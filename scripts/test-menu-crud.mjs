import fs from "node:fs";
import path from "node:path";

const base = "http://localhost:3000";
const sampleImage = path.join(
  process.cwd(),
  "uploads/menu/seed-DSC02371_1758564588950.jpg",
);
let cookie = "";

function absorbCookies(res) {
  const setCookies = res.headers.getSetCookie?.() ?? [];
  for (const raw of setCookies) {
    const part = raw.split(";")[0];
    const name = part.split("=")[0];
    if (cookie.includes(`${name}=`)) {
      cookie = cookie
        .split("; ")
        .filter((c) => !c.startsWith(`${name}=`))
        .concat(part)
        .join("; ");
    } else {
      cookie = cookie ? `${cookie}; ${part}` : part;
    }
  }
}

async function req(method, path, body, { formData, auth = false } = {}) {
  const headers = {};
  if (auth && cookie) headers.Cookie = cookie;
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${base}${path}`, { method, headers, body: payload });
  if (auth) absorbCookies(res);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

function countPublicItems(categories) {
  return (categories ?? []).reduce((sum, cat) => sum + (cat.items?.length ?? 0), 0);
}

const steps = [];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

try {
  assert(fs.existsSync(sampleImage), `Sample image tidak ada: ${sampleImage}`);

  const login = await req(
    "POST",
    "/api/auth/login",
    { username: "admin", password: "admin123", portal: "main" },
    { auth: true },
  );
  assert(login.status === 200 && login.json.success, `Login gagal`);
  steps.push("login OK");

  const publicBefore = await req("GET", "/api/menu");
  const featuredBefore = await req("GET", "/api/menu/featured");
  assert(publicBefore.status === 200, "Public menu gagal");
  const publicCountBefore = countPublicItems(publicBefore.json.categories);
  const featuredCountBefore = featuredBefore.json.items?.length ?? 0;
  steps.push("db→public menu OK");

  const catSlug = `test-kategori-${Date.now()}`;
  const createCat = await req(
    "POST",
    "/api/admin/menu/categories",
    {
      nameId: "Kategori Uji",
      nameEn: "Test Category",
      slug: catSlug,
      sortOrder: 99,
      isActive: true,
    },
    { auth: true },
  );
  assert(createCat.status === 200 && createCat.json.category?.id, `Create kategori gagal`);
  const categoryId = createCat.json.category.id;
  steps.push("api→db category OK");

  const imageBuffer = fs.readFileSync(sampleImage);
  const fd = new FormData();
  fd.append("image", new Blob([imageBuffer], { type: "image/jpeg" }), "test-menu.jpg");
  fd.append("categoryId", categoryId);
  fd.append("nameId", "Menu Uji Coba");
  fd.append("nameEn", "Test Menu Item");
  fd.append("descriptionId", "Deskripsi uji coba menu.");
  fd.append("descriptionEn", "Test menu description.");
  fd.append("tag", "Uji");
  fd.append("isFeatured", "true");
  fd.append("isActive", "true");
  fd.append("sortOrder", "0");

  const createItem = await req("POST", "/api/admin/menu/items", undefined, { formData: fd, auth: true });
  assert(createItem.status === 200 && createItem.json.item?.id, `Create item gagal: ${JSON.stringify(createItem.json)}`);
  const itemId = createItem.json.item.id;
  assert(createItem.json.item.isFeatured === true, "isFeatured harus true");
  assert(createItem.json.item.isActive === true, "isActive harus true");
  steps.push("api→db item OK");

  const publicAfterCreate = await req("GET", "/api/menu");
  const featuredAfterCreate = await req("GET", "/api/menu/featured");
  assert(
    publicAfterCreate.json.categories?.some((c) => c.id === categoryId),
    "Kategori baru tidak di menu publik",
  );
  assert(countPublicItems(publicAfterCreate.json.categories) === publicCountBefore + 1, "Jumlah item publik tidak sinkron");
  assert(
    featuredAfterCreate.json.items?.some((i) => i.id === itemId),
    "Item unggulan tidak di homepage API",
  );
  steps.push("db→public sync OK");

  const edit = await req(
    "PATCH",
    `/api/admin/menu/items/${itemId}`,
    { nameId: "Menu Uji Coba Diubah" },
    { auth: true },
  );
  assert(edit.status === 200 && edit.json.item?.nameId === "Menu Uji Coba Diubah", "Edit item gagal");
  steps.push("edit OK");

  const hide = await req(
    "PATCH",
    `/api/admin/menu/items/${itemId}/status`,
    { isActive: false },
    { auth: true },
  );
  assert(hide.status === 200 && hide.json.item?.isActive === false, "Hide item gagal");
  const publicAfterHide = await req("GET", "/api/menu");
  const featuredAfterHide = await req("GET", "/api/menu/featured");
  assert(countPublicItems(publicAfterHide.json.categories) === publicCountBefore, "Item nonaktif masih di publik");
  assert(!featuredAfterHide.json.items?.some((i) => i.id === itemId), "Item nonaktif masih unggulan");
  steps.push("hide→public sync OK");

  const show = await req(
    "PATCH",
    `/api/admin/menu/items/${itemId}/status`,
    { isActive: true },
    { auth: true },
  );
  assert(show.status === 200, "Aktifkan item gagal");
  steps.push("show OK");

  const hideCat = await req(
    "PATCH",
    `/api/admin/menu/categories/${categoryId}`,
    { isActive: false },
    { auth: true },
  );
  assert(hideCat.status === 200, "Hide kategori gagal");
  const publicAfterCatHide = await req("GET", "/api/menu");
  assert(
    !publicAfterCatHide.json.categories?.some((c) => c.id === categoryId),
    "Kategori nonaktif masih di publik",
  );
  steps.push("hide category→public sync OK");

  const showCat = await req(
    "PATCH",
    `/api/admin/menu/categories/${categoryId}`,
    { isActive: true },
    { auth: true },
  );
  assert(showCat.status === 200, "Aktifkan kategori gagal");
  steps.push("show category OK");

  const delItem = await req("DELETE", `/api/admin/menu/items/${itemId}`, undefined, { auth: true });
  assert(delItem.status === 200, "Delete item gagal");
  const publicAfterDeleteItem = await req("GET", "/api/menu");
  assert(countPublicItems(publicAfterDeleteItem.json.categories) === publicCountBefore, "Item masih di publik setelah hapus");
  steps.push("delete item OK");

  const delCat = await req("DELETE", `/api/admin/menu/categories/${categoryId}`, undefined, { auth: true });
  assert(delCat.status === 200, `Delete kategori gagal: ${JSON.stringify(delCat.json)}`);
  const adminCats = await req("GET", "/api/admin/menu/categories", undefined, { auth: true });
  assert(!adminCats.json.categories?.some((c) => c.id === categoryId), "Kategori masih ada setelah hapus");
  steps.push("delete category OK");

  const featuredAfter = await req("GET", "/api/menu/featured");
  assert((featuredAfter.json.items?.length ?? 0) === featuredCountBefore, "Featured count tidak kembali normal");
  steps.push("featured sync OK");

  console.log("ALL PASSED:", steps.join(" → "));
} catch (err) {
  console.error("FAILED at:", steps.join(" → "));
  console.error(err.message);
  process.exit(1);
}
