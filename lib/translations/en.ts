export const en = {
  brand: "Geja Kale Hiwot",
  brandSub: "CHURCH",
  ui: {
    home: "Home",
    menu: "Menu",
    openMenu: "Open menu",
    account: "Account menu",
    login: "Log in",
    logout: "Logout",
    loggingOut: "Logging out...",
    there: "there",
    signedOut: "You've signed out",
    logoutFailed: "Failed to log out",
    learnMore: "Learn more",
    readMore: "Read more",
    order: "Order",
    orderSoon: "Ordering isn't connected yet.",
    donateSoon: (n: number) => `Donations aren't connected yet (${n} ETB).`,
    donateAmount: (n: number) => `Donate ${n} ETB`,
    currency: "ETB",
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    goToSlide: (n: number) => `Go to slide ${n}`,
    prevEvents: "Previous events",
    nextEvents: "Next events",
    switchLang: "Switch language",
    langButton: "አማ",
    footer: (y: number) =>
      `© ${y} Geja Kale Hiwot Church. All rights reserved.`,
  },
  nav: ["Events", "News", "Departments", "Shop", "Donate"],
  slides: [
    {
      title: "Welcome to Geja Kale Hiwot",
      subtitle: "A community growing together in faith.",
      primary: "Get connected",
      secondary: "Learn more",
    },
    {
      title: "Join us at our next event",
      subtitle: "Worship, conferences, and community gatherings.",
      primary: "See events",
      secondary: "Latest news",
    },
    {
      title: "Listen to Our Music",
      subtitle:
        "Experience uplifting worship and praise through the music of Geja Kale Hiwot.",
      primary: "Listen on YouTube",
      secondary: "Listen on Spotify",
    },
  ],
  find: {
    title: "Find your place in our community",
    subtitle:
      "Whether you're new or have been with us for years, there's a way for you to belong and grow.",
  },
  experiences: [
    {
      title: "Events",
      text: "Find worship services, conferences, and gatherings happening near you.",
      cta: "Browse events",
    },
    {
      title: "News",
      text: "Stay up to date with announcements and stories from our church family.",
      cta: "Read the news",
    },
    {
      title: "Departments",
      text: "Discover a department where you can grow, connect, and use your gifts.",
      cta: "Explore departments",
    },
    {
      title: "Shop",
      text: "Books, apparel, and more. Every purchase supports our ministry.",
      cta: "Visit the shop",
    },
  ],
  eventsSection: {
    title: "Upcoming events",
    subtitle:
      "Join us for worship, fellowship, and special gatherings throughout the year.",
    noEvents: "No upcoming events scheduled right now.",
    noEventsSubtitle:
      "Please check back soon or stay tuned with our weekly church announcements.",
  },
  newsSection: {
    title: "Latest news",
    subtitle: "Announcements and stories from our church family.",
  },
  news: [
    {
      title: "New season of Sunday school begins",
      date: "Nov 3, 2026",
      excerpt:
        "Registration is now open for children and teens. Families can sign up after any service.",
    },
    {
      title: "Choir announces annual concert",
      date: "Oct 28, 2026",
      excerpt:
        "An evening of worship music with guest ministers and the full choir.",
    },
    {
      title: "Outreach team reaches 500 families",
      date: "Oct 15, 2026",
      excerpt:
        "Thanks to your generosity, food and supplies were delivered across the city this month.",
    },
  ],
  deptSection: {
    title: "Our departments",
    subtitle:
      "Find a team where you and your family can grow in faith and serve together.",
  },
  departments: [
    {
      name: "Worship & Choir",
      title: "Inspiring an atmosphere of worship to God.",
    },
    {
      name: "Children's Ministry",
      title: "Partnering with parents to grow kids' faith.",
    },
    {
      name: "Youth Ministry",
      title: "Developing youth who influence culture.",
    },
    { name: "Outreach", title: "Making an impact, locally and globally." },
    {
      name: "Prayer & Care",
      title: "Standing with people through every season of life.",
    },
  ],
  shopSection: {
    title: "From our shop",
    subtitle:
      "Books, apparel, and gifts. Every purchase supports our ministry.",
  },
  products: [
    { name: "Amharic Study Bible", category: "Books" },
    { name: "Worship Songbook", category: "Books" },
    { name: "Geja Kale Hiwot T-Shirt", category: "Apparel" },
    { name: "Church Mug", category: "Gifts" },
  ],
  donate: {
    title: "Support the mission",
    text: "Your generosity helps us serve our community, support families in need, and spread the gospel.",
  },
};

export type Dict = typeof en;

