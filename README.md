# use-safety

The library for safety install from npm repository (artifactory et al.)

## How to Use

```sh
npx use-safety --help
```

### Fix dependencies (npm/lerna)

```sh
npx use-safety fix
```

### Clean (npm/lerna)

```sh
npx use-safety clean [-m, --node-modules][-l, --package-lock][-a, --all]
```


### Install packages

#### npm

```sh
npx use-safety i
```

```sh
npx use-safety i moment
```

```sh
npx use-safety i moment -- --save-dev
```

#### lerna

```sh
npx use-safety --npx --lerna i
```

```sh
npx use-safety --npx --lerna i moment
```

```sh
npx use-safety --npx --lerna i moment -- --dev
```

### Pass extra arguments to npm\lerna client by placing them after `--`:

```sh
npx use-safety --npx --lerna i -- --hoist
```

## Use .env configuration

```sh
NODE_TLS_REJECT_UNAUTHORIZED=0
USE_SAFETY_REGISTRY=https://registry.npmjs.org/
USE_SAFETY_USERNAME=user
USE_SAFETY_PASSWORD=pass
USE_SAFETY_AUTH=token       (for Basic Authentication)
USE_SAFETY_AUTH_TOKEN=token (for Bearer Authentication)
USE_SAFETY_ROOT_DIR=.
DEBUG=true
```