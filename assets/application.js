//function to include html files in other html files so that features can
//separated for easier refactoring
function includeHTML() {
  var z, i, a, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    if (z[i].getAttribute("include-html")) {
      a = z[i].cloneNode(false);
      file = z[i].getAttribute("include-html");
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          a.removeAttribute("include-html");
          a.innerHTML = this.responseText;
          z[i].parentNode.replaceChild(a, z[i]);
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}
