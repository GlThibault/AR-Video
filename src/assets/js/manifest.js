const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
}

if (isIos()) {
    document.getElementById("manifest").href = "manifest-ios.webmanifest";
}