import { invoke } from '@tauri-apps/api/tauri';


const invoker = async (command, args) => {
    console.log( await invoke(command, args));
}

export default invoker;  