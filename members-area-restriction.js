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
    "/masterclasses/",
    "/masterclass-videos/",
    "/product-link/",
    "/resources/",
    "/members/",
    "/members-welcome",

];
const membershipPages = [
    "/membership/",
    "/membership",
    "membership/edit"
]

var navbar = document.getElementById('members-navigation');
var membersAreaLink = document.getElementById('members-area-link');
var searchBar = document.getElementById('top-search');

if (membersUrl.some(url => window.location.pathname.includes(url))) {
    const shopifyTags = sessionStorage.getItem("shopifyTags");
    const email = sessionStorage.getItem("email");
    if (email) {

        if (shopifyTags) {
            var search = "Livingood Daily Lifestyle";
            const arr = shopifyTags.split(", ");
            let isMember = false;

            arr.forEach(tag => {
                if (tag.includes(search)) {
                    isMember = true;
                }
            });

            if (!isMember) {
                window.location.href = "/no-membership";
            }
        } else {
            window.location.href = "/no-membership";
        }


        const name = sessionStorage.getItem("name");
        const avatar = showAvatar(name);

        navbar.style.display = "block";
    } else {
        window.location.href = "/";
    }

} else if (membershipPages.some(url => window.location.pathname.includes(url))) {
    const shopifyTags = sessionStorage.getItem("shopifyTags");

    if (shopifyTags) {
        var search = "Livingood Daily Lifestyle";
        var checkoutChampTag = "ccportal";
        var LoopTag = "Loop Active Subscriber";
        const arr = shopifyTags.split(", ");
        let isMember = false;

        arr.forEach(tag => {
            if (tag.includes(checkoutChampTag)) {
                if (window.location.pathname == '/membership/all') {
                    const CheckoutChampLink = document.getElementById("CheckoutChampLink").style.display = "flex";
                }
                const CheckoutChampNavLink = document.getElementById("CheckoutChampNavLink").style.display = "block";
                isMember = true;
            } else if (tag.includes(LoopTag)) {
                isMember = true;
                const LoopLink = document.getElementById("LoopLink").style.display = "flex";
                const LoopNavLink = document.getElementById("LoopNavLink").style.display = "block";

            }
        });
    }

    navbar.style.display = "none";
    searchBar.style.display = "none";
    membersAreaLink.style.display = "block";

} else if (window.location.pathname.includes("no-membership")) {
    const name = sessionStorage.getItem("name");
    const avatar = showAvatar(name);
} else {
    navbar.style.display = "none";
    searchBar.style.display = "none";
}

function membersIntitals(fullName) {
    const namesArray = fullName.trim().split(' ');
    if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
    else return `${namesArray[0].charAt(0)}${namesArray[namesArray.length - 1].charAt(0)}`;
}

function showAvatar(name) {

    let membersAreaIntitals

    console.log("NAME: " + name);

    if (name) {
        membersAreaIntitals = membersIntitals(name);
        const UserName = document.getElementById('UserName').textContent = name;
    } else {
        const email = sessionStorage.getItem("email");
        membersAreaIntitals = membersIntitals(email);
        const EmailField = document.getElementById('email').textContent = email;
        const UserName = document.getElementById('UserName').textContent = "Unknown";
    }

    const avatar = document.getElementById('avatarImage').textContent = membersAreaIntitals;
}