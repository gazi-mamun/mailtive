# Mailtive

Mailtive is a versatile CLI tool designed to validate email addresses with precision and efficiency. It employs advanced techniques such as email format validation, disposable email blacklist checks, DNS records verification, and SMTP server response analysis. With support for bulk email validation, Mailtive ensures the accuracy and reliability of your email lists, making it an essential tool for developers, marketers, and businesses alike.

## Installation

```bash
  npm install -g mailtive
```

## Usage/Examples

- To validate a single emails without the possibility to display the validation failure cause:

```bash
  mailtive email-address
```

- To validate a single emails with the possibility to display the validation failure cause:

```bash
  mailtive single
```

- To validate an email list:

```bash
  mailtive single
```

`Note: To validate a list of emails, you'll need a.txt file containing your emails, with each email starting on a new line.`

## License

Mailtive is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
