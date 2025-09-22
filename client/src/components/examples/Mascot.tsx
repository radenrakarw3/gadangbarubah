import Mascot from '../Mascot';

export default function MascotExample() {
  return (
    <div className="p-8">
      <Mascot 
        isAnimating={false}
        message="Halo! Selamat datang di Gadang Barubah!"
      />
    </div>
  );
}