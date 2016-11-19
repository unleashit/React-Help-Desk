var express = require('express');
var redirect = require("express-redirect");

var router = express.Router();
redirect(router);

router.redirect("/work", "/", 301);
router.redirect("/contact.html", "/", 301);
router.redirect("/about.html", "/", 301);
router.redirect("/web-design.html", "/", 301);
router.redirect("/portfolio/web-design.html", "/", 301);
router.redirect("/graphic-design.html", "http://training.jasongallagher.org/portfolio/graphic-design", 301);
router.redirect("/portfolio/graphic-design.html", "http://training.jasongallagher.org/portfolio/graphic-design", 301);
router.redirect("/services/web-design-services.html", "/", 301);
router.redirect("/services/print-design-services.html", "/", 301);
router.redirect("/blog.html", "/", 301);
router.redirect("/blog/:any", "/", 301);
router.redirect("/blog/:any/:any", "/", 301);
router.redirect("/services/lessons-and-training.html", "http://training.jasongallagher.org/services/lessons-and-training.html", 301);
router.redirect("/services/lessons-and-training/drupal-training.html", "http://training.jasongallagher.org/services/lessons-and-training/drupal-training.html", 301);
router.redirect("/services/lessons-and-training/web-design-and-development.html", "http://training.jasongallagher.org/services/lessons-and-training/web-design-and-development.html", 301);
router.redirect("/services/lessons-and-training/photoshop-training.html", "http://training.jasongallagher.org/services/lessons-and-training/photoshop-training.html", 301);
router.redirect("/services/lessons-and-training/indesign-training.html", "http://training.jasongallagher.org/services/lessons-and-training/indesign-training.html", 301);
router.redirect("/services/lessons-and-training/illustrator-training.html", "http://training.jasongallagher.org/services/lessons-and-training/illustrator-training.html", 301);

router.get('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'https://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
        next();
    }
});

module.exports = router;