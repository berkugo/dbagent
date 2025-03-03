import { listen } from '@tauri-apps/api/event';
import DatabaseModel from '../models/DatabaseModel';
import { v4 as uuidv4 } from 'uuid';

const connections = new Map(); // Bağlantıları tutacak Map

const startListeningForConnectionEvents = (connectionStatus, setActiveConnectionId) => {
    const unlisten = listen('database-connection', (event) => {
        const { status, message, data } = event.payload;
        const connectionId = uuidv4(); // Yeni bir unique ID oluştur
        if (status === 'success') {
            // Yeni bir DatabaseModel instance'ı oluştur
            const dbModel = new DatabaseModel(connectionId);
            dbModel.setSchemaData(data[0]);
            dbModel.setConnection(data[0]);
            // Bağlantıyı Map'e kaydet
            connections.set(connectionId, dbModel);
            setActiveConnectionId(connectionId);
            connectionStatus({
                isLoading: false,
                message: `Connection established: ${message}`,
                type: 'success',
            });
        } else {
            // Bağlantı başarısız olduğunda ilgili modeli Map'ten sil
            if (connectionId && connections.has(connectionId)) {
                connections.delete(connectionId);
            }
            
            setTimeout(() => {
                connectionStatus({
                    isLoading: false,
                    message: `Connection failed: ${message}`,
                    type: 'error'
                });
            }, 3000);
        }
    });

    return () => {
        unlisten.then(f => f());
    };
}

// Bağlantılara erişim için yardımcı fonksiyonlar
export const getConnection = (connectionId) => connections.get(connectionId);
export const getAllConnections = () => Array.from(connections.values());
export const removeConnection = (connectionId) => connections.delete(connectionId);
export {startListeningForConnectionEvents};