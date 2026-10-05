// "Tem nhãn cho từng [[ngành hàng]]" -> HTML có từ nhấn <em class="hl">
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const emph = (s: string) => esc(s).replace(/\[\[(.+?)\]\]/g, '<em class="hl">$1</em>').replace(/\n/g, '<br />');
export const plain = (s: string) => s.replace(/\[\[(.+?)\]\]/g, '$1').replace(/\n/g, ' ');
