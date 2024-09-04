FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env 
WORKDIR /app
EXPOSE 8080
EXPOSE 80

COPY SmartMenu.sln SmartMenu.sln
COPY ["./FSU.SmartMenuWithAI.API/FSU.SmartMenuWithAI.API.csproj", "./FSU.SmartMenuWithAI.API/"]

# Restore package deps  
RUN dotnet restore SmartMenu.sln

COPY SmartMenu SmartMenu
WORKDIR /app/SmartMenu
RUN dotnet publish -c Release -o /app/out 

# runtime 
FROM mcr.microsoft.com/dotnet/aspnet:8.0 
WORKDIR /app 
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "FSU.SmartMenuWithAI.API.dll" ]