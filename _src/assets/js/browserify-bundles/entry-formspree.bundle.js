!function (error) {
  console.error(error);
  if (typeof document === 'undefined') {
    return;
  } else if (!document.body) {
    document.addEventListener('DOMContentLoaded', print);
  } else {
    print();
  }
  function print() {
    var pre = document.createElement('pre');
    pre.className = 'errorify';
    pre.textContent = error.message || error;
    if (document.body.firstChild) {
      document.body.insertBefore(pre, document.body.firstChild);
    } else {
      document.body.appendChild(pre);
    }
  }
}({"message":"ENOENT: no such file or directory, open '/Users/azizjaved/Projects/mmwc-website/_src/assets/js/forms/ContactUrlChange.js'","name":"Error","stack":"Error: ENOENT: no such file or directory, open '/Users/azizjaved/Projects/mmwc-website/_src/assets/js/forms/ContactUrlChange.js'\n    at Error (native)"})