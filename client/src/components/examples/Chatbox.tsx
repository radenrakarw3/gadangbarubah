import { useState } from 'react';
import Chatbox from '../Chatbox';

export default function ChatboxExample() {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleUniMessage = (message: string) => {
    console.log('Uni says:', message);
  };

  return (
    <div className="relative h-screen bg-background">
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Chatbox dengan Tombol Pilihan</h2>
        <p className="text-muted-foreground">Pilih opsi untuk berinteraksi dengan Uni!</p>
      </div>
      <Chatbox 
        isVisible={isVisible}
        onToggle={handleToggle}
        onUniMessage={handleUniMessage}
      />
    </div>
  );
}