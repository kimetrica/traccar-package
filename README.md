# traccar-package
The Docker image that is built from this repo compiles tag `v3.4` of the [Traccar](https://github.com/tananaev/traccar) source code (has to be mounted into the container). The packages are moved to `/traccar-packages/`. This folder can be mounted or the resulting packages can be retrieved by using `docker cp`.
To allow customized code bases and to not create a huge image, the Docker image does not contain a copy of the Traccar source code. This has to be mounted inside the container, replacing `/traccar`.

Usage example: `docker run -ti --rm -v $(pwd)/traccar:/traccar -v $(pwd)/traccar-packages:/traccar-packages traccar-package`

The container fails to build Windows packages at the moment but this should be easy to fix (for example `wine32` needs to be installed).
