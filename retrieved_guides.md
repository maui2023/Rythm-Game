
--- Guide for autofill-sign-in-form ---
# Build a sign-in form that follows best practice

Use cross-platform browser features to build sign-in forms that are secure, accessible and easy to use.

If users ever need to sign in to your site, then good sign-in form design is critical. This is especially true for people on poor connections, on mobile, in a hurry, or under stress. Poorly designed sign-in forms get high bounce rates. Each bounce could mean a lost customer and a disgruntled user—not just a missed sign-in opportunity.

## How to implement

Outlined below are the most important guidelines for building successful sign-in forms.

### Use meaningful, valid HTML

Make the most of the elements and attributes built for creating forms:

- `<form>`, `<input>`, `<label>`, and `<button>`
- `type`, `autocomplete`, and `inputmode`

These enable built-in browser functionality, improve accessibility, and add meaning to markup.

### Use the `<label>` element to label form fields for data entry

To label an `<input>`, `<select>`, or `<textarea>`, use a `<label>`. Associate a label with an input by giving the label's `for` attribute the same value as the input's `id`.

### Make the most of HTML attributes

Make it easy for users to enter data, by using the appropriate `<input>` element `<type>` attribute to provide the right keyboard on mobile and enable basic built-in validation by the browser.

Always use `type="email"` for email addresses and `type="tel"` for phone numbers.

Every `<input>`, `<select>`, and `<textarea>` element SHOULD have an appropriate `autocomplete` attribute, to improve accessibility and help users avoid re-entering data.

### Make buttons helpful

Use `<button>` for buttons. You can also use `<input type="submit">`, but don't use a `div` or some other random element acting as a button. Button elements provide accessible behaviour, built-in form submission functionality, and can easily be styled.

Give each form submit button a value that says what it does. Use a clear, recognizable label. For example, use **Sign In** rather than **Continue** or **Submit**.

### Use a single name input where possible

Allow your users to enter their name using a single input, unless you have a good reason for separately storing given names, family names, honorifics, or other name parts. Using a single name input makes forms less complex, enables cut-and-paste, and makes autofill simpler.

Allow international names. For validation, avoid using regular expressions that only match Latin characters. Latin-only excludes users with names or addresses that include characters that aren't in the Latin alphabet. Allow Unicode letter matching instead—and ensure your backend supports Unicode securely as both input and output. Unicode in regular expressions is well supported by modern browsers.

### Show sign-in progress

For each step towards sign-in, use page headings and descriptive button values that make it clear what needs to be done now, and what the next step is.

Use the `enterkeyhint` attribute on form inputs to set the mobile keyboard enter key label. For example, use `enterkeyhint="previous"` and `enterkeyhint="next"` within a multi-page form, `enterkeyhint="done"` for the final input in the form, and `enterkeyhint="search"` for a search input.

### Help users avoid re-entering sign-in data

Make sure to add appropriate `autocomplete` values in sign-in forms.

This enables browsers to help users by securely storing sign-in details and correctly entering form data. Without autocomplete, users may be more likely to keep a physical record of sign-in details, or store sign-in data insecurely on their device.

### Validate carefully

Validate data entry both in realtime and before form submission. Use `type="email"` for email inputs — the browser will validate the format automatically. Add the `required` attribute to mandatory fields to prevent empty submissions.

### Put sign-in in its own `<form>` element

Always use the `<form>` element when you're getting users to enter data

Don't wrap inputs in a `<div>` and handle input data submission purely with JavaScript. It's generally better to use a `<form>` element. This makes your site accessible to screenreaders and other assistive devices, enables a range of built-in browser features, makes it simpler to build basic functional sign-in for older browsers, and can still work even if JavaScript fails.

### Don't double up inputs

Some sites force users to enter emails or passwords twice. That might reduce errors for a few users, but causes extra work for all users, and increases abandonment rates. Asking twice also makes no sense where browsers autofill email addresses or suggest strong passwords. It's better to enable users to confirm their email address (you'll need to do that anyway) and make it easy for them to reset their password if necessary.

### Keep passwords private—but enable users to see them if they want

Passwords inputs should have `type="password"` to hide password text and help the browser understand that the input is for passwords. (Note that browsers use a variety of techniques to understand input roles and decide whether or not to offer to save passwords.)

You should add a **Show password** toggle to enable users to check the text they've entered—and don't forget to add a **Forgot password** link.

### Give mobile users the right keyboard

Use `<input type="email">` to give mobile users an appropriate keyboard and enable basic built-in email address validation by the browser… no JavaScript required!

If you need to use a telephone number instead of an email address, `<input type="tel">` enables a telephone keypad on mobile. You can also use the `inputmode` attribute where necessary: `inputmode="numeric"` is ideal for PIN numbers.

### Prevent mobile keyboard from obstructing the Sign in button

If you're not careful, mobile keyboards may cover your form or, worse, partially obstruct the Sign in button. Users may give up before realizing what has happened.

Where possible, avoid this by displaying only the email (or phone) and password inputs and Sign in button at the top of your sign-in page. Put other content underneath.

### Help users to avoid re-entering data

You can help browsers store data correctly and autofill inputs, so users don't have to remember to enter email and password values. This is particularly important on mobile, and crucial for email inputs, which get high abandonment rates. There are two parts to this:

1.  The `autocomplete`, `name`, `id`, and `type` attributes help browsers understand the role of inputs in order to store data that can later be used for autofill. To allow data to be stored for autofill, modern browsers also require inputs to have a stable `name` or `id` value (not randomly generated on each page load or site deployment), and to be in a `<form>` element with a `submit` button.
1.  The `autocomplete` attribute helps browsers correctly autofill inputs using stored data.

For email inputs use `autocomplete="username"`, since `username` is recognized by password managers in modern browsers—even though you should use `type="email"` and you may want to use `id="email"` and `name="email"`. For password inputs, use the appropriate `autocomplete` and `id` values to help browsers differentiate between new and current passwords.

### Use autocomplete="current-password" and id="current-password" for an existing password

MANDATORY: Use `autocomplete="current-password"` and `id="current-password"` for the password input in a sign-in form. This tells the browser that you want it to use the current password that it has stored for the site.

For a sign-in form:

```
<input type="password" autocomplete="current-password" id="current-password" …>
```

### Enable the browser to suggest a strong password

Modern browsers use heuristics to decide when to show the password manager UI and suggest a strong password.

Built-in browser password generators mean users and developers don't need to work out what a "strong password" is. Since browsers can securely store passwords and autofill them as necessary, there's no need for users to remember or enter passwords. Encouraging users to take advantage of built-in browser password generators also means they're more likely to use a unique, strong password on your site, and less likely to reuse a password that could be compromised elsewhere.

### Help save users from accidentally missing inputs

MANDATORY: Add the `required` attribute to both email and password fields. Modern browsers automatically prompt and set focus for missing data.

```html
<input type="email" id="email" name="email" autocomplete="username" required>
<input type="password" id="password" name="password" autocomplete="current-password" required>
```

### Allow password pasting

Some sites don't allow text to be pasted into password inputs.

Disallowing password pasting annoys users, encourages passwords that are memorable (and therefore may be easier to compromise) and, according to organizations such as the UK National Cyber Security Centre, may actually reduce security. Users only become aware that pasting is disallowed after they try to paste their password, so disallowing password pasting doesn't avoid clipboard vulnerabilities.

### Fallback strategies

Baseline status for Email, telephone, and URL <input> types: Widely available. It's been Baseline since 2015-07-29.
Supported by: Chrome 5 (May 2010), Edge 12 (Jul 2015), Firefox 4 (Mar 2011), Safari 5 (Jun 2010), and Safari iOS 3 (Jun 2009).
Baseline status for inputmode: Widely available. It's been Baseline since 2021-12-07.
Supported by: Chrome 66 (Apr 2018), Edge 79 (Jan 2020), Firefox 95 (Dec 2021), Safari 12.1 (Mar 2019), and Safari iOS 12.2 (Mar 2019).

Autofill is a progressive enhancement. In browsers that do not support autofill, users will simply need to manually enter their sign-in credentials. The semantic HTML constraints (such as `type`, `inputmode`, and `required`) will still function appropriately to validate user input and provide the correct virtual keyboards.


--- Guide for autofill-sign-up-form ---
# Build a sign-up form that follows best practice

Use cross-platform browser features to build sign-up forms that are secure, accessible and easy to use.

If users ever need to sign up to your site, then good sign-up form design is critical. This is especially true for people on poor connections, on mobile, in a hurry, or under stress. Poorly designed sign-up forms get high bounce rates. Each bounce could mean a lost customer and a disgruntled user—not just a missed sign-up opportunity.

## How to implement

Outlined below are the most important guidelines for building successful sign-up forms.

### Use meaningful, valid HTML

Make the most of the elements and attributes built for creating forms:

-   `<form>`, `<input>`, `<label>`, and `<button>`
-   `type`, `autocomplete`, and `inputmode`

These enable built-in browser functionality, improve accessibility, and add meaning to markup.

### Use the `<label>` element to label form fields for data entry

To label an `<input>`, `<select>`, or `<textarea>`, use a `<label>`. Associate a label with an input by giving the label's `for` attribute the same value as the input's `id`.

### Make the most of HTML attributes

Make it easy for users to enter data, by using the appropriate `<input>` element `<type>` attribute to provide the right keyboard on mobile and enable basic built-in validation by the browser.

Always use `type="email"` for email addresses and `type="tel"` for phone numbers.

Every `<input>`, `<select>`, and `<textarea>` element SHOULD have an appropriate `autocomplete` attribute, to improve accessibility and help users avoid re-entering data.

### Make buttons helpful

Use `<button>` for buttons. You can also use `<input type="submit">`, but don't use a `div` or some other random element acting as a button. Button elements provide accessible behaviour, built-in form submission functionality, and can easily be styled.

Give each form submit button a value that says what it does. Use a clear, recognizable label. For example, use **Create account** or **Sign up** rather than **Continue** or **Submit**.

### Use a single name input where possible

Allow your users to enter their name using a single input, unless you have a good reason for separately storing given names, family names, honorifics, or other name parts. Using a single name input makes forms less complex, enables cut-and-paste, and makes autofill simpler.

Allow international names. For validation, avoid using regular expressions that only match Latin characters. Latin-only excludes users with names or addresses that include characters that aren't in the Latin alphabet. Allow Unicode letter matching instead—and ensure your backend supports Unicode securely as both input and output. Unicode in regular expressions is well supported by modern browsers.

### Show sign-up progress

For each step towards sign-up, use page headings and descriptive button values that make it clear what needs to be done now, and what the next step is.

Use the `enterkeyhint` attribute on form inputs to set the mobile keyboard enter key label. For example, use `enterkeyhint="previous"` and `enterkeyhint="next"` within a multi-page form, `enterkeyhint="done"` for the final input in the form, and `enterkeyhint="search"` for a search input.

### Help users avoid re-entering sign-up data

Make sure to add appropriate `autocomplete` values in sign-up forms.

This enables browsers to help users by securely storing sign-up details and correctly entering form data. Without autocomplete, users may be more likely to keep a physical record of sign-up details, or store sign-up data insecurely on their device.

### Validate carefully

Validate data entry both in realtime and before form submission. Use `type="email"` for email inputs — the browser will validate the format automatically. For passwords, use a `pattern` attribute to enforce strength requirements and provide clear error messages when validation fails. Add the `required` attribute to mandatory fields to prevent empty submissions.

### Put sign-up in its own `<form>` element

Always use the `<form>` element when you're getting users to enter data

Don't wrap inputs in a `<div>` and handle input data submission purely with JavaScript. It's generally better to use a `<form>` element. This makes your site accessible to screenreaders and other assistive devices, enables a range of built-in browser features, makes it simpler to build basic functional sign-up for older browsers, and can still work even if JavaScript fails.

### Don't double up inputs

Some sites force users to enter emails or passwords twice. That might reduce errors for a few users, but causes extra work for all users, and increases abandonment rates. Asking twice also makes no sense where browsers autofill email addresses or suggest strong passwords. It's better to enable users to confirm their email address (you'll need to do that anyway) and make it easy for them to reset their password if necessary.

### Keep passwords private—but enable users to see them if they want

Passwords inputs should have `type="password"` to hide password text and help the browser understand that the input is for passwords. (Note that browsers use a variety of techniques to understand input roles and decide whether or not to offer to save passwords.)

You should add a **Show password** toggle to enable users to check the text they've entered—and don't forget to add a **Forgot password** link.

### Give mobile users the right keyboard

Use `<input type="email">` to give mobile users an appropriate keyboard and enable basic built-in email address validation by the browser… no JavaScript required!

If you need to use a telephone number instead of an email address, `<input type="tel">` enables a telephone keypad on mobile. You can also use the `inputmode` attribute where necessary: `inputmode="numeric"` is ideal for PIN numbers.

### Prevent mobile keyboard from obstructing the Sign up button

If you're not careful, mobile keyboards may cover your form or, worse, partially obstruct the Sign up button. Users may give up before realizing what has happened.

Where possible, avoid this by displaying only the email (or phone) and password inputs and Sign up button at the top of your sign-up page. Put other content underneath.

### Help users to avoid re-entering data

You can help browsers store data correctly and autofill inputs, so users don't have to remember to enter email and password values. This is particularly important on mobile, and crucial for email inputs, which get high abandonment rates. There are two parts to this:

1.  The `autocomplete`, `name`, `id`, and `type` attributes help browsers understand the role of inputs in order to store data that can later be used for autofill. To allow data to be stored for autofill, modern browsers also require inputs to have a stable `name` or `id` value (not randomly generated on each page load or site deployment), and to be in a `<form>` element with a `submit` button.
1.  The `autocomplete` attribute helps browsers correctly autofill inputs using stored data.

For email inputs use `autocomplete="username"`, since `username` is recognized by password managers in modern browsers—even though you should use `type="email"` and you may want to use `id="email"` and `name="email"`. For password inputs, use the appropriate `autocomplete` and `id` values to help browsers differentiate between new and current passwords.

### Use autocomplete="new-password" and id="new-password" for a new password

MANDATORY: For a sign-up form, use `autocomplete="new-password"`.

```html
<!-- new-password prevents password managers from auto-filling an existing password into this field -->
<input type="password" id="new-password" name="new-password" autocomplete="new-password" required>
```

### Enable the browser to suggest a strong password

Modern browsers use heuristics to decide when to show the password manager UI and suggest a strong password.

Built-in browser password generators mean users and developers don't need to work out what a "strong password" is. Since browsers can securely store passwords and autofill them as necessary, there's no need for users to remember or enter passwords. Encouraging users to take advantage of built-in browser password generators also means they're more likely to use a unique, strong password on your site, and less likely to reuse a password that could be compromised elsewhere.

### Help save users from accidentally missing inputs

Add the `required` attribute to both email and password fields. Modern browsers automatically prompt and set focus for missing data.

### Allow password pasting

Some sites don't allow text to be pasted into password inputs.

Disallowing password pasting annoys users, encourages passwords that are memorable (and therefore may be easier to compromise) and, according to organizations such as the UK National Cyber Security Centre, may actually reduce security. Users only become aware that pasting is disallowed after they try to paste their password, so disallowing password pasting doesn't avoid clipboard vulnerabilities.

### Offer third-party login

Many users prefer to sign in to websites using an email address and password sign-up form. However, you should also enable users to sign in using a third-party identity provider, also known as federated login.

This approach has several advantages. For users who create an account using federated login, you don't need to ask for, communicate, or store passwords.

You may also be able to access additional verified profile information from federated login, such as an email address—which means the user doesn't have to enter that data and you don't need to do the verification yourself. Federated login can also make it much easier for users when they get a new device.

### Take care with usernames

Don't insist on a username unless (or until) you need one. Enable users to sign up and sign in with only an email address (or telephone number) and password—or federated login if they prefer. Don't force them to choose and remember a username.

If your site does require usernames, don't impose unreasonable rules on them, and don't stop users from updating their username. On your backend you should generate a unique ID for every user account, not an identifier based on personal data such as username.

Also make sure to use `autocomplete="username"` for usernames.

### Fallback strategies

Baseline status for Email, telephone, and URL <input> types: Widely available. It's been Baseline since 2015-07-29.
Supported by: Chrome 5 (May 2010), Edge 12 (Jul 2015), Firefox 4 (Mar 2011), Safari 5 (Jun 2010), and Safari iOS 3 (Jun 2009).
Baseline status for inputmode: Widely available. It's been Baseline since 2021-12-07.
Supported by: Chrome 66 (Apr 2018), Edge 79 (Jan 2020), Firefox 95 (Dec 2021), Safari 12.1 (Mar 2019), and Safari iOS 12.2 (Mar 2019).

Autofill is a progressive enhancement. In browsers that do not support autofill, users will simply need to manually enter their sign-up credentials. The semantic HTML constraints (such as `type`, `inputmode`, and `required`) will still function appropriately to validate user input and provide the correct virtual keyboards.


--- Guide for html ---
## Table of Contents

1. Fundamental Semantics and Validation
2. Content Grouping and Attribution
3. Resource Prioritization and Performance
4. Native Overlays: Dialogs and Popovers
5. Disclosures: Details and Summary
6. Focus Boundaries and Visibility
7. HTML APIs and Forms Grouping
8. Native Media Elements
9. Dynamic Styles and Interactivity

## 1. Fundamental Semantics and Validation

### Guidelines

- **DO** use the standard HTML5 doctype `<!DOCTYPE html>` to prevent quirky rendering modes. 
- **DO** set the `lang` attribute on the `<html>` element for screen reader pronunciation and translation tools.
- **DO** use the `<meta name="viewport">` element with the `content` attribute set to `"width=device-width, initial-scale=1.0"` to ensure page responsiveness.
- **DO** use a single `<h1>` per page/view representing the main topic. Exceptions can be made for modal dialogs, which can also use a single `<h1>`.
- **DO** maintain a sequential, non-skipping heading hierarchy (`<h2>` to `<h3>`, but not `<h2>` to `<h4>`).
- **DO** use semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) to create regional navigation for assistive technologies.
- **DO** use `<search>` to enclose search and filtering mechanisms (eliminates the need for `role="search"`).
- **DO** use `<button>` for triggered actions (JS, Modals, Forms) and `<a>` strictly for URL navigation. Set `type="button"` for non-submit buttons in forms to prevent unintended submission.
- **DO** use `<ul>`, `<ol>`, and `<dl>` elements for list content. 
- **DO** ensure that all interactive elements like links and buttons have accessible names.  
- **DO** hide purely decorative SVG images from assistive technology using `aria-hidden="true"`. If using a decorative `<img>`, always include an empty `alt` attribute (e.g. `alt=""`). 
- **DO** ensure that informative SVGs like logos, data visualizations, or icon buttons have a proper accessible name. 

- **DON'T** use generic `<div>` or `<span>` when semantic elements exist, for instance for interactive elements, headings, or independently reusable self-contained content.
- **DON'T** use boolean attributes with redundant values (e.g., use `disabled`, not `disabled="disabled"`).
- **DON'T** use generic elements with added ARIA roles or states when native elements with built-in semantics and behavior exist.
- **DON'T** change the native semantics of elements with ARIA unless it is a critical requirement. 
- **DON'T** use `role="presentation"` or `aria-hidden="true"` on focusable elements or their parents and ancestors. 
- **DON'T** disable page zooming capabilities.

### Code Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard | Platform</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
     <h1>Analytics</h1>
    <search>
      <form action="/filter" method="GET">
        <label for="search-input">Scan items:</label>
        <input type="search" id="search-input" name="q">
        <button type="submit">Search</button>
      </form>
    </search>
    <article>
      <h2>First post</h2>
    </article>
  </main>
</body>
</html>
```

## 2. Content Grouping and Attribution

### Guidelines

- **DO** use `<blockquote>` for extended quotations from another source, and use the `cite` attribute to provide a machine-readable URL for that source.
- **DO** use `<figure>` to group self-contained content (images, code snippets, or quotes) that is referenced from the main flow but could be moved to an appendix or sidebar without affecting the document's meaning.
- **DO** use `<figcaption>` as the first or last child of a `<figure>` to provide a human-readable caption or attribution.
- **DO** use the `<cite>` element inside a caption or attribution to identify the **title** of a work (e.g., a book or website name), not the author's name.
- **DO** use the `<code>` element for short fragments of computer code (e.g., variable names, file paths, or inline snippets).
- **DO** wrap `<code>` inside a `<pre>` element when displaying blocks of code to preserve whitespace and line breaks.
- **DO** ensure that code blocks are accessible by adding `tabindex="0"` to the `<pre>` element if it becomes scrollable, allowing keyboard users to reach the content.

- **DON'T** use `<blockquote>` for purely visual indentation of non-quoted text.
- **DON'T** use `<figure>` for every single image; use it only when a caption is required or when the content is a distinct, referenced unit.
- **DON'T** use `<pre>` without `<code>` for code blocks; `<pre>` alone only preserves formatting but doesn't convey that the content is a computer language.

### Code Example

```html
<!-- Quote with attribution using Figure -->
<figure>
  <blockquote cite="https://html.spec.whatwg.org/">
    <p>The figure element represents some flow content, optionally with a caption, that is self-contained and is typically referenced as a single unit from the main flow of the document.</p>
  </blockquote>
  <figcaption>
    Definition of the &lt;figure&gt; element from the <cite>HTML Living Standard</cite>
  </figcaption>
</figure>

<!-- Image with caption -->
<figure>
  <img 
    src="architecture-diagram.webp" 
    alt="Diagram showing the flow between Client, API Gateway, and Microservices"
    width="800"
    height="450"
    loading="lazy"
  >
  <figcaption>Figure 1: High-level system architecture overview.</figcaption>
</figure>

<!-- Code block with accessibility and language hint -->
<figure>
  <figcaption>Example configuration:</figcaption>
  <pre tabindex="0"><code class="language-json">
{
  "name": "gemini-cli",
  "version": "1.0.0",
  "private": true
}
  </code></pre>
</figure>

<!-- Inline code -->
<p>To initialize the project, run the <code>npm install</code> command.</p>
```

## 3. Resource Prioritization and Performance

### Guidelines

- **DO** use `fetchpriority="high"` for the Largest Contentful Paint (LCP) element (e.g., hero image) to elevate network priority.
- **DO** use `<link rel="preload" as="image">` with `fetchpriority="high"` for LCP background images defined in CSS.
- **DO** apply `loading="lazy"` to off-screen images and iframes to defer bandwidth.
- **DO** specify `width` and `height` on all `<img>` tags to preserve aspect ratio and prevent Layout Shifts (CLS).
- **DO** use the `srcset` attribute on `<img>`s for adding multiple versions of the same image at different sizes.
- **DO** use the `<picture>` element with a fallback `<img>` for more fine-grained image control like switching between image formats, image sizes, and cropping images at different device sizes. 

- **DON'T** apply `loading="lazy"` to above-the-fold or hero images. This delays LCP.
- **DON'T** overuse `fetchpriority="high"`; prioritization is a zero-sum mechanism. Use `fetchpriority="low"` to demote non-critical trackers or carousel items.

### Code Example

```html
<!-- High-priority hero image with responsive sizes -->
<img 
  src="hero-large.webp" 
  srcset="hero-small.webp 480w, hero-medium.webp 800w, hero-large.webp 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 70vw"
  alt="Main product view" 
  fetchpriority="high" 
  width="1200" 
  height="600"
>

<!-- Art direction and format switching with <picture> -->
<picture>
  <!-- Mobile Art Direction: Different aspect ratio (square) and format (AVIF) -->
  <source 
    media="(max-width: 600px)" 
    srcset="hero-mobile.avif 1x, hero-mobile-2x.avif 2x" 
    type="image/avif"
    width="600" 
    height="600"
  >
  <source 
    media="(max-width: 600px)" 
    srcset="hero-mobile.webp 1x, hero-mobile-2x.webp 2x"
    width="600" 
    height="600"
  >
  
  <!-- Desktop: Modern format for primary layout -->
  <source srcset="hero-desktop.avif" type="image/avif">

  <!-- Fallback img defines the default aspect ratio (2:1) -->
  <img 
    src="hero-desktop.webp" 
    alt="Platform dashboard overview" 
    width="1200" 
    height="600"
    loading="lazy"
  >
</picture>

<!-- Low-priority decorative footer image -->
<img 
  src="footer-art.png" 
  alt="" 
  loading="lazy" 
  width="200" 
  height="100"
>
```

## 4. Native Overlays: Dialogs and Popovers

### Guidelines

See `declarative-dialog-popover-control` (via `npx -y modern-web-guidance@latest retrieve "declarative-dialog-popover-control"`) for more info on fallback strategies for using the Popover API in a cross-browser way.
- **DO** use `<dialog>` for modal overlays (requires JS `.showModal()`) to automatically trap focus, dim backgrounds, and support dismissing via `Esc`. Use the `closedby="any"` attribute to enable native "light-dismiss" (closing on backdrop click) without custom JavaScript.
- **DO** utilize the Popover API (`popover` attribute) for non-modal UI (menus, tooltips) that do not require focus traps.
- **DO** use `::backdrop` to style modal backgrounds.
- **DO** use `<form method="dialog">` to dismiss dialogs without manual JS handlers. Combined button `formmethod="dialog"` yields the button's value to the dialog `.returnValue`.

- **DON'T** use `show()` for modals where keyboard traps are expected (use `showModal()`).
- **DON'T** call `showModal()` on elements possessing a `popover` attribute (they are mutually exclusive programmatic states). However, `<dialog popover="auto">` is a valid declarative architecture to combine dialog semantics with light-dismiss mechanics.

### Code Example

```html
<!-- Popover (No JS required for toggle) -->
<button popovertarget="help-menu">Info</button>
<div id="help-menu" popover="auto">
  <p>Standard help text.</p>
</div>

<!-- Modal Dialog with Form-based closing -->
<button id="show-dialog">Open dialog</button>
<dialog id="fav-modal">
  <!-- method="dialog" closes the dialog natively and sets the returnValue -->
  <form method="dialog">
    <p>Confirm action?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById("fav-modal");
  const openModal = document.getElementById("show-dialog");
  
  // Show modal dialog
  openModal.addEventListener('click', () => dialog.showModal());
  
  // Listen for the 'close' event to retrieve the user's choice (returnValue)
  dialog.addEventListener('close', () => {
    console.log(dialog.returnValue); // "confirm" or "cancel"
  });
</script>
```

### Native UI Overlay & Disclosure Matrix

| Feature | Modality | Focus | Dismiss Mechanism | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **`<dialog>`** | Modal / Non-modal | Automatic trap (Modal) | Esc / Form / `closedby` | Critical Actions, Settings |
| **`[popover]`** | Non-modal | Standard Tab flow | Light-dismiss (Click outside) | Menus, Tooltips, Toasts |
| **`<details>`** | Inline Disclosure | Standard Tab flow | Toggle summary | Accordions, FAQs |

**Heuristic Rule**: Use `<dialog>` for interruptions requiring user action, `popover` for transient info, and `<details>` for inline content expansion.

## 5. Disclosures: Details and Summary

### Guidelines

- **DO** use `<details>` and `<summary>` for native accordions or revealable content without JS.
- **DO** place `<summary>` as the *first* child of `<details>`.
- If headings must be used within a `<summary>`, consider if the heading is essential for understanding or navigating the document structure. If it is, use a more robust disclosure approach that allows wrapping the disclosure trigger with the heading (e.g. `<h2><button type="button" aria-expanded="false" aria-controls="significant-section-content">Significant section</button></h2>`). This ensures the heading semantics aren’t lost, and the button and its state are announced.
- **DO** use `details[open]` attribute for styling expanded states.
- **DO** use `details::details-content` for styling the contents of the `<details>` element.
- **DO** use the `name` attribute on multiple `<details>` elements to create exclusive accordions (opening one closes others).

- **DON'T** nest other interactive elements (links, buttons) directly inside `<summary>` text as it acts as a button and breaks focus.
- **DON'T** hide visible triangles via `list-style: none` without providing explicit directional cues (via `::before`/`::after` pseudo-elements).
- **DON'T** use the `title` attribute to create tooltip effects. 

### Code Example

```html
<!-- Exclusive Accordion Set -->
<details name="faq">
  <summary>Item 1</summary>
  <p>Contents...</p>
</details>
<details name="faq">
  <summary>Item 2</summary>
  <p>Contents...</p>
</details>
```

## 6. Focus Boundaries and Visibility

### Guidelines

- **DO** use the global `inert` attribute for entire hidden sections (off-screen menus, background while custom modal is open) to remove them from tab flows and accessibility trees.
- **DO** pair `[inert]` with CSS (`opacity: 0.5`) to visually signify inactivity.
- **DO** rely on natural DOM order for sequential navigation. 

- **DON'T** use positive `tabindex` values (e.g., `1`, `2`). Use `0` to add element to tab flow, or `-1` for JS program focus.
- **DON'T** alter focus flow using CSS properties (`flex-flow: row-reverse`, `order`) without aligning the DOM structure.
- **DON'T** use `node.focus({ preventScroll: true })` without usability validation; it can hide the focused element off-screen.

### Code Example

```html
<!-- De-tabbing a background app shell while custom drawer is open -->
<main id="app-shell" inert>
  <a href="/">Dashboard</a>
</main>
<aside id="drawer">
  <button>Close</button>
</aside>
```

```css
[inert], [inert] * {
  opacity: 0.5;
  cursor: default;
  user-select: none;
}
```

## 7. HTML APIs and Forms Grouping

### Guidelines

See `forms` (via `npx -y modern-web-guidance@latest retrieve "forms"`) for more details on creating modern web forms.

- **DO** utilize the `form="form-id"` attribute to decouple inputs from the physical `<form>` tree.
- **DO** use `<datalist>` coupled with `<input list="id">` for lightweight auto-suggestions (note: visually unstylable and has screen-reader quirks). 
- **DON'T** use `autocomplete="off"` on credential, address, payment, or contact fields. Browsers and password managers ignore it there by design. Use a specific token instead (`autocomplete="email"`, `"street-address"`, `"cc-number"`, etc.).
- **DON'T** use `autocomplete="off"` unless handling highly sensitive tracking tokens (violates standard password manager overrides). Use standard inputs `type="email"`, `type="tel"`.
- **DO** distinguish `autocomplete="current-password"` (sign-in) from `autocomplete="new-password"` (registration / password change) so password managers offer the right action.                                                    
- **DO** match `autocomplete` tokens with appropriate `inputmode` and `type` (`type="email"` + `inputmode="email"` + `autocomplete="email"`). They control different things — keyboard, validation, and autofill respectively — and reinforce each other.

### Code Example

```html
<form>
  <fieldset>
    <legend>Address Information</legend>
    <label for="city">City:</label>
    <input type="text" id="city" list="cities" autocomplete="address-level2">
    <datalist id="cities">
      <option value="New York">
      <option value="London">
    </datalist>
  </fieldset>
</form>
```

## 8. Native Media Elements

### Guidelines

- **DO** set `width` and `height` to prevent layout shifts (CLS) on `<video>` elements.
- **DO** provide a `poster` image fallback for videos.
- **DO** include subtitles and captions with `<track>`.
- **DO** ensure background videos are `muted`, provide users with full control over playback, and use `role="none"` or `aria-hidden="true"`. The `controls` attribute must also be omitted to make sure the video is not focusable.  

- **DON'T** rely on JS for basic video controls if native `controls` attribute is sufficient.
- **DON'T** apply `role="none"` or `aria-hidden="true"` to focusable elements (such as embedded interactive `<iframe>` components). Hiding elements from the assistive technology tree while leaving them accessible to sequential keyboard navigation violates core accessibility heuristics. The background video exception holds solely because omitting the `controls` attribute renders the `<video>` element fully non-focusable.

### Code Example

```html
<video 
  controls 
  width="800" 
  height="450" 
  poster="poster.webp"
>
  <source src="intro.webm" type="video/webm">
  <source src="intro.mp4" type="video/mp4">
  <track src="caps.vtt" kind="captions" srclang="en" label="English">
</video>
```

## 9. Dynamic Styles and Interactivity

### Guidelines
- **DO** use the `style` attribute to pass state to CSS via **Custom Properties**. This keeps visual logic in your stylesheet while JavaScript provides the raw data.

- **DON'T** use inline styles for static design (colors, padding, margins) that belong in a stylesheet.
- **DON'T** use inline event handlers (e.g., `onclick`). Trigger actions using `addEventListener()`.

### Code Example

```html
<body>
  <!-- Progress with style-driven color data -->
  <label for="upload-progress">Upload status:</label>
  <progress id="upload-progress" class="loading-bar" value="0" max="100" style="--brand-hue: 200;"></progress>

  <script>
    const updateProgress = (percent, hue) => {
      const bar = document.querySelector('.loading-bar');
      bar.value = percent;
      
      // Update dynamic style variable 
      if (hue) bar.style.setProperty('--brand-hue', hue);
    };

    // Example: Move to 85% and shift color to green (120)
    setTimeout(() => updateProgress(85, 120), 1000);
  </script>
</body>
```
```css
.loading-bar {
  accent-color: hsl(var(--brand-hue, 200) 80% 50%);
  transition: accent-color 0.3s ease;
}
```

