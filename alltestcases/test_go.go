package main

import (
	"errors"
	"fmt"
	"os"

	"tracelify-go/tracelify"
)

const DSN = "http://c6be43b8f03ccc3fda5e98f02d0aadee@54.251.156.151.nip.io:8000/api/73473f45-113e-4f33-a037-b40b66a5efc1/events"

func main() {
	fmt.Println("=== Tracelify Go SDK — Comprehensive Integration Test ===")
	fmt.Println("DSN:", DSN)
	fmt.Println()

	sdk, err := tracelify.NewTracelify(DSN, "1.0.0")
	if err != nil {
		panic(err)
	}

	user := map[string]interface{}{
		"id":    "usr_go_006",
		"email": "gopher@tracelify.io",
		"name":  "Go Tester",
	}
	sdk.SetUser(user)
	sdk.SetTag("env", "production")
	sdk.SetTag("sdk", "tracelify.go")

	// 1. Basic Error
	fmt.Println("[1] Capturing Basic Error...")
	sdk.CaptureException(errors.New("basic go error occurred"))

	// 2. Wrap error
	fmt.Println("[2] Capturing Wrapped Error...")
	sdk.CaptureException(fmt.Errorf("database query failed: %w", errors.New("timeout deadlocked")))

	// 3. File not found
	fmt.Println("[3] Capturing File Not Found Error...")
	_, err = os.Open("/usr/secrets/doesnotexist.conf")
	if err != nil {
		sdk.CaptureException(err)
	}

	// 4. Custom Panic (simulated by recovering and creating an error)
	fmt.Println("[4] Capturing Panic Error...")
	func() {
		defer func() {
			if r := recover(); r != nil {
				sdk.CaptureException(fmt.Errorf("panic recovered: %v", r))
			}
		}()
		panic("unexpected memory violation")
	}()

	fmt.Println("\nSignaling Shutdown and awaiting flush...")
	sdk.Shutdown()

	fmt.Println("\n✅ Done — distinct issues tracked in Tracelify platform via Go SDK.")
}
