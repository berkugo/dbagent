import { invoke } from '@tauri-apps/api/tauri';


const invoker = async (command, args) => {
    try {
        console.log(`Invoking ${command} with args:`, args);
        const result = await invoke(command, args);
        console.log(`Result of ${command}:`, result);
        return result;
    } catch (error) {
        console.error(`Error invoking ${command}:`, error);
        throw error;
    }
}

export default invoker;  