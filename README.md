# Own Your Digital Real Estate: A Free Personal Links Hub on GitHub Pages

You have digital assets scattered across the internet—social profiles, portfolios, projects, maybe a newsletter. You want one clean URL to point people to all of them. You do **not** want to pay a hosting platform $20–$30 a month just to display a page of links.

This guide shows you how to do it for **free** (aside from the domain, roughly $10–$15 per year). You will own your data, own your domain, and control your digital real estate.

The whole thing runs on **GitHub Pages**, a free static-site hosting service built into GitHub. It is fast, reliable, and requires no server management.

---

## What You Are Actually Building

Here is the map, so nothing feels like magic later:

```
Visitor types:  yourname.com
                     ↓
              DNS records (at your domain registrar)
                     ↓
              GitHub Pages servers (free hosting)
                     ↓
              Your HTML/CSS files (stored in a GitHub repository)
```

There are three separate systems at play:

1. **Your domain registrar** (where you buy the domain, e.g., Cloudflare).
2. **Your DNS provider** (often the same as the registrar; it holds the records that tell the internet where your site lives).
3. **GitHub Pages** (where your actual files live and are served from).

The job is to connect all three correctly. That is what the steps below do.

---

## Step 1: Buy a Domain

**1a.** You need a domain name—the address people type to find you (like `yourname.com`).

**Where to buy:** Cloudflare Registrar is the recommended choice. It sells domains at wholesale cost with no markup, no first-year bait-and-switch pricing, and free WHOIS privacy. Porkbun and Namecheap are also solid alternatives.

**A warning that will save you hours:** The email address you use when registering the domain (the **registrant contact**) must be a personal email you will always control—not an `@yourdomain.com` address. If you use an email on the domain itself and that email breaks, you will be locked out of your own domain when verification emails cannot reach you. This is exactly the trap that turns a ten-minute setup into a multi-day support ordeal.

---

## Step 2: Create the GitHub Repository (The Right Way)

**2a.** You need a free GitHub account.

**2b.** Sign in or create one at `github.com`.

**2c.** Create a **new repository**.

**The naming rule is critical:** The repository name must be exactly:

```
YOUR-USERNAME.github.io
```

For example, if your GitHub username is `TariqJohnson`, the repository must be named `TariqJohnson.github.io`. Not `personal-website`, not `links`, not `TariqJohnson.github.io-v2`. The exact match is what activates GitHub Pages for a **user site** (a site served at the root of your username, not inside a project path).

If you name it incorrectly, GitHub will treat it as a **project site** (served at `username.github.io/repo-name`), which changes how custom domains work and adds unnecessary complexity.

**2d.** Once the repository exists, GitHub Pages is automatically available. GitHub will host any static site (HTML, CSS, JavaScript—no server-side code) for free. It is responsive and very fast for static content.

**A step almost every guide misses:** Before you touch DNS, you must first add your custom domain in **GitHub’s repository settings**. Go to:

```
Repository → Settings → Pages → Custom domain
```

Type your domain (e.g., `yourname.com`) and click **Save**. This does two things:

1. It creates a file called **`CNAME`** in the root of your repository, containing your domain name. This file tells GitHub which domain the site belongs to. Do not delete it.
2. It **claims the domain on GitHub’s side first**, which prevents domain-takeover attacks. If you configure DNS before claiming the domain in GitHub, a stranger could potentially host a site on your subdomain.

---

## Step 3: Upload Your Site Files

**3a.** Find a template or write your own HTML. If you need free templates, start with:

- `freehtml5.co` (free HTML5 templates)
- `html5up.net` (clean, responsive, free with attribution)
- Any WordPress theme’s static export, if you prefer that design

**3b.** Edit the code. You can be as simple or as creative as you want. The author of this guide used GitHub Copilot and the free Claude version to generate the HTML file, which is a perfectly valid approach.

**What GitHub Pages needs:** At minimum, an `index.html` file in the root of the repository (or in the folder you configure as the publishing source). That is your homepage. CSS, JavaScript, and images can sit alongside it.

Commit your files to the repository. If you are editing directly on GitHub, use the **Add file → Upload files** button or edit `index.html` in the browser and click **Commit changes**.

---

## Step 4: Configure DNS Records (The Part That Actually Connects Everything)

This is where most guides wave their hands and say “enter details here.” Here are the exact details.

You are setting up an **apex domain**—the bare domain without `www` (e.g., `yourname.com`). GitHub recommends configuring both the apex domain **and** the `www` subdomain, because this gives you automatic redirects in both directions and better HTTPS coverage.

### 4a. The Four A Records (for the apex domain)

In your DNS provider’s dashboard (e.g., Cloudflare → DNS → Records), create **four** records of type **A**:

| Type | Name / Host | Content / Value | Proxy status (Cloudflare) |
|------|-------------|-----------------|---------------------------|
| A | `@` (or leave blank) | `185.199.108.153` | **DNS only** (grey cloud) |
| A | `@` (or leave blank) | `185.199.109.153` | **DNS only** (grey cloud) |
| A | `@` (or leave blank) | `185.199.110.153` | **DNS only** (grey cloud) |
| A | `@` (or leave blank) | `185.199.111.153` | **DNS only** (grey cloud) |

**Why four?** GitHub runs multiple servers for redundancy. All four IPs must be present so traffic can reach any of them.

**What `@` means:** In DNS, `@` is shorthand for the apex (root) domain—`yourname.com` itself, without any subdomain in front.

**If you use Cloudflare:** The **Proxy status must be “DNS only”** (grey cloud), not “Proxied” (orange cloud). If Cloudflare proxies the traffic, GitHub cannot complete its HTTP-01 ACME challenge, and HTTPS provisioning will fail or get stuck. This is the single most common Cloudflare-specific mistake.

### 4b. The CNAME Record (for `www`)

Create one record of type **CNAME**:

| Type | Name / Host | Content / Value | Proxy status (Cloudflare) |
|------|-------------|-----------------|---------------------------|
| CNAME | `www` | `YOUR-USERNAME.github.io` | **DNS only** (grey cloud) |

**The CNAME target must be exactly `YOUR-USERNAME.github.io`**—without the repository name. Do not point it at `YOUR-USERNAME.github.io/repo-name`, and do not point it at the unique `*.pages.github.io` subdomain shown in GitHub’s settings. Those are common mistakes that prevent the connection from working.

### 4c. Optional but recommended: IPv6 (AAAA records)

GitHub also supports IPv6. If you want to add AAAA records for completeness, these are the values:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

GitHub recommends using an A record **in addition** to AAAA records, because IPv6 adoption is still uneven. The four A records above are the essential part; the AAAA records are a bonus.

### 4d. Remove old or conflicting records

Before adding the records above, delete any existing A records, CNAME records, or ALIAS/ANAME records for `@` and `www` that point somewhere else. Conflicting records prevent GitHub from routing your domain correctly.

Also: **do not use wildcard DNS records** (`*.yourname.com`). GitHub explicitly warns that wildcards put you at risk of domain takeover, even after verification.

---

## Step 5: Verify the DNS Is Correct (Before You Move On)

DNS changes can take anywhere from a few minutes to **24 hours** to propagate. You do not have to guess whether it worked. Use the `dig` command in your terminal:

**Check the A records:**
```bash
dig yourname.com +noall +answer -t A
```

You should see four lines, each ending in one of GitHub’s IPs (`185.199.108.153` through `185.199.111.153`).

**Check the CNAME:**
```bash
dig www.yourname.com +noall +answer -t CNAME
```

You should see a line pointing to `YOUR-USERNAME.github.io`.

If you are on Windows, `dig` is not installed by default. Use PowerShell’s `Resolve-DnsName yourname.com` instead.

**Do not proceed to the next step until these checks pass.** If they fail, the records are wrong or still propagating. Wait and retry.

---

## Step 6: Enable HTTPS (Free SSL Certificate)

Once DNS is verified, return to **GitHub → Repository → Settings → Pages**.

Under **“Enforce HTTPS,”** check the box.

What this does:

- GitHub automatically provisions a free **TLS/SSL certificate** through **Let’s Encrypt**.
- It redirects all `http://` traffic to `https://`, so visitors always get the padlock icon.
- The checkbox may be **greyed out for up to 24 hours** while GitHub validates your DNS and issues the certificate. This is normal. Wait, then check again.

**If the checkbox stays greyed out for more than 24–48 hours:**

1. Confirm the DNS records are correct (`dig` again).
2. If you use Cloudflare, confirm both A records and the CNAME are set to **DNS only** (grey cloud), not Proxied.
3. In Cloudflare, set **SSL/TLS → Overview → Encryption mode** to **Full** (not “Flexible,” and not “Full (Strict)” during initial setup). GitHub Pages serves HTTPS, but the initial certificate provisioning can be sensitive to proxy interference.
4. If you added and removed the custom domain in GitHub settings, a stale CNAME file or cached DNS state can block re-provisioning. Delete the `CNAME` file from the repository, re-add the domain in GitHub settings, and wait again.

---

## Step 7: Test Everything

Open a browser and visit:

- `https://yourname.com` → should load your site with a padlock.
- `https://www.yourname.com` → should redirect to whichever version you set as primary (GitHub handles this automatically once both apex and `www` records are configured).
- `http://yourname.com` → should redirect to `https://`.

If the padlock is missing or the site does not load, the issue is almost always DNS or the Cloudflare proxy setting. Re-check Step 4 and Step 5.

---

## Common Mistakes (and How to Avoid Them)

| Mistake | Why it breaks | Fix |
|---------|---------------|-----|
| Repository is not named `USERNAME.github.io` | GitHub treats it as a project site, and custom domain routing behaves differently | Rename the repository to the exact pattern |
| DNS configured **before** claiming the domain in GitHub | Domain takeover risk; GitHub may reject the connection | Add the domain in **Settings → Pages → Custom domain** first, then do DNS |
| `www` CNAME points to `USERNAME.github.io/repo-name` | GitHub expects the CNAME to point to the bare `github.io` host, not a repository path | Change the CNAME target to `USERNAME.github.io` |
| Cloudflare proxy is ON (orange cloud) for GitHub Pages records | Breaks GitHub’s Let’s Encrypt challenge; HTTPS gets stuck | Set all GitHub-related records to **DNS only** (grey cloud) |
| Old A/CNAME records left in place | Conflicting records prevent GitHub from routing traffic | Delete all existing `@` and `www` records before adding the new ones |
| “Enforce HTTPS” left unchecked | Visitors see `http://` and browser security warnings | Check the box after DNS verification; wait up to 24 hours if greyed out |
| Registrant email is an `@yourdomain.com` address | If the domain’s email breaks, you cannot receive verification or recovery emails | Use a personal email (Proton, Gmail, etc.) as the registrant contact, always |

---

## What This Costs

| Item | Cost |
|------|------|
| GitHub account | Free |
| GitHub Pages hosting (static sites, public repos) | Free |
| SSL/TLS certificate (via Let’s Encrypt) | Free |
| Domain registration (`.com` at Cloudflare) | ~$10–$12 per year |

No monthly hosting fee. No server to maintain. No platform upselling you a “Pro” plan for a links page.

---

## The Mental Model to Take Away

DNS is just a set of instructions that tells the internet where to find your files. GitHub Pages is the free warehouse where the files live. Your domain is the street address people type. The A records and CNAME are the directions that connect the address to the warehouse.

Once you have done it once, the pattern generalizes: every static site you deploy on GitHub Pages uses the same four A records and the same `USERNAME.github.io` CNAME. The only thing that changes is the domain name in the `CNAME` file and in GitHub’s settings.

You are no longer paying a platform to host a page of links. You own the domain, you own the content, and the hosting is free.

That is what owning your digital real estate looks like.
