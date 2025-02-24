
import { listen } from '@tauri-apps/api/event';

const startListeningForConnectionEvents = (connectionStatus) => {

    const unlisten = listen('database-connection', (event) => {
        const { status, message } = event.payload;
        
        if (status === 'success') {
            connectionStatus({
                isLoading: false,
                message: `Connection established: ${message}`,
                type: 'success'
              });
        } else {
            
            setTimeout(() => {
                connectionStatus({
                    isLoading: false,
                    message: `Connection failed: ${message}`,
                    type: 'error'
                  });
            }, 3000);
        }
        });

  // Component unmount olduğunda listener'ı temizle
  return () => {
    unlisten.then(f => f());
  };
}

export default startListeningForConnectionEvents;