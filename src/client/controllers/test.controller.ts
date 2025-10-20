import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class TestController implements OnStart {
    onStart() {
        print("hello, world!")
    }
}