package yatbd;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/")
public class TestController {


    @RequestMapping(value = "", method = RequestMethod.GET)
    public String test() {
        return "Hello World";
    }

}
