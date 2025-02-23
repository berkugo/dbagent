const validateConnection = (connection) => {
    const errors = [];
  
    // Host validation
    if (!connection.host || connection.host.trim() === '') {
      errors.push('Host cannot be empty');
    }
  
    // Port validation
    const port = parseInt(connection.port);
    if (isNaN(port) || port <= 0 || port > 65535) {
      errors.push('Port must be a number between 1 and 65535');
    }
  
    // Username validation
    if (!connection.username || connection.username.trim() === '') {
      errors.push('Username cannot be empty');
    }
  
    // Database name validation
    if (!connection.database || connection.database.trim() === '') {
      errors.push('Database name cannot be empty');
    }
  
    // Password validation (optional, depending on your requirements)
    if (!connection.password) {
      errors.push('Password cannot be empty');
    }
  
    return errors;
  };
  export default validateConnection;