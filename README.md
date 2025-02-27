# Social Oracle Application

| Stage | Status                                                                                                                                                                                                                                                                                                                | URL                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| PROD  | ![Build dev](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSWNlOGNWM2xpYXZ6SkZiZlBycEZSSmQyK2J0RFVKektnVUxhVG1uc3JaZzUxZHAzYTlLOU9sY2FwbmlIUEw0REVWN21LUXBkK3dKYUdlRjhCa09qMlFRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjZ4SGJTZm5WcDVxNEZkelEiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=develop) | https://d1fq8e8mhf6u5t.cloudfront.net |

This repository contains source code for the Social Oracle application frontend.

**Social Oracle** is a decentralized prediction marketplace focused on social events and platform-based outcomes. It enables users to trade outcome shares (e.g., *Yes* or *No*) for events tied to platforms like LinkedIn, X (formerly Twitter), Twitch, LinkedIn, Youtube, IMDB, etc.  

# Social Oracle Repositories  

The complete application is divided into three repositories:  

- **Frontend (FE):** [https://github.com/kalmiallc/social-oracle-app](https://github.com/kalmiallc/social-oracle-app)  
- **Backend (BE):** [https://github.com/kalmiallc/social-oracle-backend](https://github.com/kalmiallc/social-oracle-backend)  
- **Smart Contracts (SC):** [https://github.com/kalmiallc/social-oracle-contracts](https://github.com/kalmiallc/social-oracle-contracts)  

A full description of the product, including functionality and usage, can be found in the repository of the **Frontend application**.

**Tehnical descripiton** can be found [here](https://github.com/kalmiallc/social-oracle-backend/blob/main/TehnicalDescription.md)

## Core Features  

- **Prediction Market:**  
  Users buy or sell outcome shares for various events. Share prices are dynamically adjusted based on the ratio of investments in competing outcomes.  

- **Event Resolution:**  
  Upon market resolution, users who backed the correct outcome are rewarded, including a share of the investments from losing predictions.  

- **Transaction Fees:**  
  A small transaction fee is applied to each trade.  

- **Social Platform Integration:**  
  Events are designed to reflect social platform activity, with examples including:  
  - LinkedIn engagement metrics  
  - X (Twitter) trends  
  - Twitch viewership milestones  
  - IMDB ratings and reviews  

- **Privy Embedded Wallet:**  
  Social Oracle integrates with the **Privy embedded wallet** to enable seamless user authentication via social platforms.  

- **Gihub Perks:**   
  Users with high GitHub contributions and followers benefit from reduced transaction fees.  


## Stack

- node 20.8.1
- Nuxt 3
- Vue 3 w/ TypeScript
- Pinia Store
- NaiveUI
- TailwindCSS
- Wagmi & viem

## Info

### API

API interaction should be done with `fetch` api wrapper. Globally imported as `$api`.

```js
await $api.get('/login', formData);
```

### Blockchain

Blockchain connection is realized with [viem](https://viem.sh/) and [wagmi](https://github.com/wagmi-dev/wagmi). For easier integration, a vue wrapper is used: [use-wagmi](https://github.com/unicape/use-wagmi). Docs for react hooks work with use-wagmi: [https://wagmi.sh/react/hooks/useAccount](https://wagmi.sh/react/hooks/useAccount).

Wagmi config is in `~/plugins/use-wagmi.ts`. Connectors, available chains and RPC urls can be defined here.

### Error handling

Errors are handled with the global function `apiError` and displayed as toast message with Naive UI. Error messages need to be translated, so error messages are written to `~/locales/en.json`

```js
  } catch (error) {
    message.error(apiError(error));
  }
```

### Vueuse

Many common tasks can be solved with using helper functions from [vueuse](https://vueuse.org/functions.html). Use those instead of reinventing the wheel.

eg.

```js
useIntersectionObserver();
useInfiniteScroll();
useScroll();
useScrollLock();
```

### Images

Use `<Image />` component to lazy load images. Implements [v-lazy-image](https://github.com/alexjoverm/v-lazy-image). `:src` can be link to (eg. public assets `./images/test.png`), or image imported as module.

For images that dont need lazy load, use html `<img>`. The `:src` can then also be provided with resolve token (eg. `~/assets/images/test.png`).

```html
<script>
  import imgTest from '~/assets/images/test.png';
</script>

<image :src="imgTest" width="1436" height="1513" />

<image src="./images/test.png" width="1436" height="1513" />

<img src="~/assets/images/test.png" width="1436" height="1513" />
```

### Icons

Add icon svg to `/assets/icons`, then use `<NuxtIcon :name="" />` component to use the icon - set name prop to filename. Implements [nuxt-icons](https://github.com/gitFoxCode/nuxt-icons).

Control size with font-size.

```html
<NuxtIcon name="larr" class="inline-block text-[18px] mr-3 align-middle" />
```

### Icons (Icomoon)

Control size with font-size and color.

```html
<span class="icon-${iconName} text-xl mr-2"></span>
```

### Breakpoints

For basic styles, use tailwind breakpoint system. For js usage, use `useScreen` composable.

```js
const screens = reactive(useScreen());
// or
const { isXl } = useScreen();
```

```html
<div v-if="screens.isXl" class="w-8 h-8 bg-red"></div>
<div v-else class="w-8 h-8 bg-blue"></div>
```


# Installation and Running the Application

1. **Install Dependencies**  
   ```bash
   npm install
   ```

2. **Setup config**  
  
  Set up needed variables in the `lib/config/development.ts`

2. **Run application**  
   ```bash
   npm run dev
   ```
