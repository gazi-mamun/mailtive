import { validate } from "../utils/validation/validation.js";

describe("test for validation fail", () => {
  it("should fail for invalid email format", async () => {
    const res = await validate("testgmail.com");

    expect(res.valid).toBe(false);
    expect(res.failLevel).toBe("format");
    expect(res.failReason).toBe("Invalid email format.");
  });

  it("should fail for invalid email format", async () => {
    const res = await validate("test@gmailcom");

    expect(res.valid).toBe(false);
    expect(res.failLevel).toBe("format");
    expect(res.failReason).toBe("Invalid email format.");
  });

  it("should fail for disposable email", async () => {
    const res = await validate("test@009988211.com");

    expect(res.valid).toBe(false);
    expect(res.failLevel).toBe("disposable");
    expect(res.failReason).toBe(
      "Email was created using a disposable email service."
    );
  });
  it("should fail for mx record", async () => {
    const res = await validate("test@dealekhane.com");

    expect(res.valid).toBe(false);
    expect(res.failLevel).toBe("mx");
    expect(res.failReason).toBe("MX record not found.");
  });
  it("should fail for smtp ping", async () => {
    const res = await validate("test@dealsekhane.com");

    expect(res.valid).toBe(false);
    expect(res.failLevel).toBe("smtp");
  });
});

describe("test for validation success", () => {
  it("should pass for being valid email", async () => {
    const res = await validate("none1009@gmail.com");

    expect(res.valid).toBe(true);
  });
});
