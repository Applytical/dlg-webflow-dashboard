const shopifyTags = sessionStorage.getItem("shopifyTags");
if (shopifyTags) {
   var search = "Livingood Daily Lifestyle";
   var arr = shopifyTags.split(", ");
   if (arr.indexOf(search) == -1) {
      window.location.href = "/no-membership";
   }
} else {
   window.location.href = "/no-membership";
}