import crypto from 'crypto';

// https://gist.github.com/devm33/9443419
export function randString(n = 6): string {
  if (n <= 0) {
    return '';
  }
  let rs = '';
  try {
    rs = crypto
      .randomBytes(Math.ceil(n / 2))
      .toString('hex')
      .slice(0, n);
    /* note: could do this non-blocking, but still might fail */
  } catch (ex) {
    /* known exception cause: depletion of entropy info for randomBytes */
    console.error('Exception generating random string: ' + ex);
    /* weaker random fallback */
    rs = '';
    const r = n % 8;
    const q = (n - r) / 8;
    let i;
    for (i = 0; i < q; i++) {
      rs += Math.random().toString(16).slice(2);
    }
    if (r > 0) {
      rs += Math.random().toString(16).slice(2, i);
    }
  }
  return rs;
}
