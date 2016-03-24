FROM java:7

RUN apt-get update && apt-get install -y maven wine makeself innoextract zip && apt-get clean

RUN git clone https://github.com/tananaev/traccar.git

WORKDIR /traccar

COPY ext-6.0.0 /ext-6.0.0
COPY Sencha /Sencha
# These packages need to be in /traccar/setup for packaging.
# To make it possible to replace the Traccar sources these files are
# moved into /traccar/setup when creating the package not here
COPY wrapper-delta-pack-3.5.27.tar.gz /traccar_package_dependencies/
COPY wrapper-windows-x86-64-3.5.28.zip /traccar_package_dependencies/
COPY isetup-5.5.3.exe /traccar_package_dependencies/

# Add Sencha Cmd to PATH
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/Sencha/Cmd/6.0.2.14

# run mvn package once on build time, will save much time because packages
# are already pulled by maven
RUN mvn package

RUN mkdir /traccar-packages

CMD mvn package \
&& cd setup \
&& mv -v /traccar_package_dependencies/* . \
&& ./package.sh 3.4 \
&& mv -v traccar-*.zip /traccar-packages/
