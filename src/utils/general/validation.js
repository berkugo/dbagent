const validateField = (name, value) => {
  switch (name) {
    case 'name':
      return !value.trim() ? 'Connection name is required' : '';
    case 'host':
      if (!value.trim()) return 'Host is required';
      // IP address regex
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      // Domain regex (basic validation)
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
      // Localhost check
      if (value === 'localhost') return '';
      // Check if it's either a valid IP or domain
      if (!ipRegex.test(value) && !domainRegex.test(value)) {
        return 'Please enter a valid IP address or domain name';
      }
      return '';
    case 'port':
      if (!value.trim()) return 'Port is required';
      if (!/^\d+$/.test(value)) return 'Port must be a number';
      if (parseInt(value) < 1 || parseInt(value) > 65535) return 'Port must be between 1 and 65535';
      return '';
    case 'database':
      return !value.trim() ? 'Database name is required' : '';
    case 'username':
      return !value.trim() ? 'Username is required' : '';
    case 'password':
      return !value.trim() ? 'Password is required' : '';
    default:
      return '';
  }
};

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

export { validateConnection, validateField };