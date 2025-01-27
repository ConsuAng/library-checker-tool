const { execSync } = require("child_process");
const axios = require("axios");

module.exports = async (options) => {
  const library = Object.values(options)[0];

  const npmList = execSync(`npm list --depth=0 --json`).toString();
  const parsedList = JSON.parse(npmList);
  const installedVersion = parsedList.dependencies?.[library]?.version;

  if (!installedVersion) {
    console.log(`La librería ${library} no está instalada.`);
    return;
  }

  console.log(`Versión instalada de ${library}: ${installedVersion}`);

  try {
    const { data } = await axios.get(`https://registry.npmjs.org/${library}`);
    const latestVersion = data["dist-tags"].latest;
    console.log(`Última versión disponible de ${library}: ${latestVersion}`);

    if(installedVersion !== latestVersion) {
      console.log("Hay una versión más reciente disponible.");
      if(options.update) {
        console.log(`Actualizando ${library} a la versión ${latestVersion}...`);
        if(options.serve) {
          execSync(`npm install ${library}@${latestVersion} && ng serve`, { stdio: "inherit" });
        } else {
          execSync(`npm install ${library}@${latestVersion}`, { stdio: "inherit" });
        }
      }
      if(options.build) {
        execSync(`npm install ${library}@${latestVersion} && ng build`, { stdio: "inherit" });
      }
    } else {
      console.log("La versión instalada es la más reciente.");
      if(options.serve) {
        execSync(`ng serve`, { stdio: "inherit" });
      }
      if(options.build) {
        execSync(`ng build`, { stdio: "inherit" });
      }
    }
  } catch (error) {
    console.error(`Error al verificar la librería ${library}:`, error.message);    
  }

};