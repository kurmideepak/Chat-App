package com.deep.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ChatAppBackendApplication {

	public static void main (String[] args) {
		SpringApplication.run(ChatAppBackendApplication.class, args);

	}

	@RestController
	class DefaultController {

		@GetMapping("/")
		public String home() {
			return "Welcome to the Chat App Backend!";
		}
	}
}
