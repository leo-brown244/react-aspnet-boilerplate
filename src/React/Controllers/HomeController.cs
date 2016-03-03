﻿using Microsoft.AspNet.Mvc;
using React.ViewModels;

namespace React.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index(string greeting = "Hello!")
        {
            // make some database calls, w/e.
            return View("js-/", new GreetingViewModel
            {
                Greeting = greeting
            });
        }

        public IActionResult About()
        {
            return View("js-/about");
        }
    }
}
