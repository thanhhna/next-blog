import React from 'react';

export default function Clicky() {
  return process.env.NODE_ENV === 'production' ? (
    <>
      <script>
        var clicky_site_ids = clicky_site_ids || [];
        clicky_site_ids.push(101231340);
      </script>
      <script async src="//static.getclicky.com/js" />
    </>
  ) : null;
}
