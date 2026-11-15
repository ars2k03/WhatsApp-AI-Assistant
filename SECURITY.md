# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| `1.x` | Yes |
| `< 1.0` | No |

## Reporting a vulnerability

If you find a security issue (auth bypass, secret leakage, remote code execution, WhatsApp session theft, etc.):

1. **Do not** open a public GitHub issue.
2. Email or message the maintainer privately via GitHub: [@ars2k03](https://github.com/ars2k03)
3. Include steps to reproduce, impact, and any suggested fix.

We aim to acknowledge reports within 7 days.

## Hardening tips for operators

- Never commit `.env` or session dumps.
- Rotate `ARS_API_KEY`, Groq, Google, and Tavily keys if exposed.
- Restrict MongoDB Atlas Network Access to known IPs when possible.
- Keep dependencies updated (`npm outdated`).

## Disclaimer

This software talks to WhatsApp through an unofficial client library. Using it may violate WhatsApp’s Terms of Service. You are responsible for how you deploy and operate it.
