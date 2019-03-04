export function generateRoomCode(n) {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  console.log(text);
  return text;
}

export function copyTextToClipboard(text) {
  console.log(text);
  // if (!navigator.clipboard) {
  //   fallbackCopyTextToClipboard(text);
  //   return;
  // }
  // navigator.clipboard.writeText(text).then(
  //   () => {
  //     console.log('Async: Copying to clipboard was successful!');
  //   },
  //   err => {
  //     console.error('Async: Could not copy text: ', err);
  //   },
  // );
}
