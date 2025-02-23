
import { listen } from '@tauri-apps/api/event';
import { toast } from 'react-toastify';

const startListeningForConnectionEvents = () => {

    const unlisten = listen('database-connection', (event) => {
        const { status, message } = event.payload;
        
        if (status === 'success') {
            toast.success(message);
        } else {
            toast.error("Connection error.");
            setTimeout(() => {
                toast.info(message);
            }, 3000);
        }
        });

  // Component unmount olduğunda listener'ı temizle
  return () => {
    unlisten.then(f => f());
  };
}

export default startListeningForConnectionEvents;