// GithubAuth.js
import React from 'react';

function GithubAuth() {
  const handleOAuth = async () => {
    try {
      window.location.href = 'http://localhost:3001/auth/github';

    } catch (error) {
      console.error('OAuth initiation failed:', error);
    }
  };

  return (
    <button onClick={handleOAuth}>GITHUB AUTH</button>
  );
}

export default GithubAuth;
