import { invoke } from '@tauri-apps/api/tauri';


const invoker = async (command, args) => {
    await invoke(command, args);
}

export default invoker;  