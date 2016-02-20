# traccar-package
The Docker image that is built from this repo compiles tag `v3.3` of the [Traccar](https://github.com/tananaev/traccar) source code. The packages are moved to `/traccar-packages/`. This folder can be mounted or the resulting packages can be retrieved by using `docker cp`.
To use a custom code base just mount it into the Docker container replacing `/traccar`.

Usage example: `docker run -ti --rm -v $(pwd)/traccar:/traccar -v $(pwd)/traccar-packages:/traccar-packages traccar-package`

The container fails to build Windows packages at the moment but this should be easy to fix (for example `wine32` needs to be installed).
