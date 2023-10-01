import React, { useEffect, useState } from 'react';


export default function Home() {
//   const [tronLink, setTronLink] = useState(null);

  useEffect(() => {
    // Check if TronLink is installed
    async function getTronWeb() {
        let tronWeb;
        if (window.tronLink.ready) {
          tronWeb = window.tronLink.tronWeb;
        } else {
          const res = await tronLink.request({ method: 'tron_requestAccounts' });
          if (res.code === 200) {
            tronWeb = window.tronLink.tronWeb;
          }
        }

        return tronWeb;
      }
    getTronWeb()
    
  }, [])
  return (
    <button >Get Account</button>
  );
};
