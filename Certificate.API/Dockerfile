FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Certificate.API/Certificate.API.csproj", "Certificate.API/"]
RUN dotnet restore "Certificate.API/Certificate.API.csproj"
COPY . .
WORKDIR "/src/Certificate.API"
RUN dotnet build "Certificate.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Certificate.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Certificate.API.dll"]
