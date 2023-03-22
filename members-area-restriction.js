const membersUrl = [
    "/training/",
"/grocery-store-tour/",
"/grocery-store-tour-videos/",
"/daily-challenge/",
"/daily-challenge-resources/",
"/health/",
"/advanced-challenges/",
"/workout-videos/",
"/workouts/",
"/meal-plans/",
"/masterclassses/",
"/masterclass-videos/",
"/product-link/",
"/resources/",
"/members/",
"/members-welcome"
]

if (membersUrl.includes(window.location.pathname)) {
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

    function membersIntitals(fullName) {
        const namesArray = fullName.trim().split(' ');
        if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
        else return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`;
    }
    let membersAreaIntitals

    const name = sessionStorage.getItem("name");

    if (name) {
        membersAreaIntitals = membersIntitals(name);
        const UserName = document.getElementById('UserName').textContent = name;
    } else {
        const email = sessionStorage.getItem("email");
        membersAreaIntitals = membersIntitals(email);
        const EmailField = document.getElementById('email').textContent = email;

    }

    const avatar = document.getElementById('avatarImage').textContent = membersAreaIntitals;


    const navbar = document.getElementById('members-navigation').style.display = "block";

}