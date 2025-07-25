export function generateUserData() {
  const code = [...Array(4)]
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  return {
    fullName: `Test User ${code}`,
    email: `testuser${code.toLowerCase()}@example.com`,
    phone: `1234567${Math.floor(Math.random() * 1000)}`,
  };
}

