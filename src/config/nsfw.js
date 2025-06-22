import axios from "axios";
import FormData from "form-data";
import { logger } from "../utils/logger.js";
import { NSFW_API_SECRET, NSFW_API_USER } from "../envs/index.js";

export const isNsfw = async (
  imageBuffer,
  mimetype = "image/jpeg",
  originalname = "image.jpg"
) => {
  const formData = new FormData();
  formData.append("media", imageBuffer, {
    filename: originalname,
    contentType: mimetype,
  });

  formData.append(
    "models",
    "nudity-2.1,weapon,alcohol,recreational_drug,medical,offensive-2.0,faces,scam,text-content,face-attributes,gore-2.0,text,violence,self-harm"
  );
  formData.append("api_user", `${NSFW_API_USER}`);
  formData.append("api_secret", `${NSFW_API_SECRET}`);

  try {
    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      formData,
      { headers: formData.getHeaders() }
    );

    const data = response.data;

    if (data.status !== "success") {
      throw new Error("Sightengine API failed.");
    }

    const {
      nudity: {
        sexual_activity,
        sexual_display,
        erotica,
        very_suggestive,
        suggestive,
        mildly_suggestive,
        none,
      },
      gore,
      violence,
      weapon,
      scam,
    } = data;

    const suggestiveScore = Math.max(
      sexual_activity,
      sexual_display,
      erotica,
      very_suggestive,
      suggestive,
      mildly_suggestive
    );

    const goreScore = gore?.prob || 0;
    const violenceScore = violence?.prob || 0;
    const weaponScore = Math.max(...Object.values(weapon?.classes || {}));
    const scamScore = scam?.prob || 0;

    if (
      suggestiveScore > 0.7 ||
      goreScore > 0.5 ||
      violenceScore > 0.5 ||
      weaponScore > 0.5 ||
      scamScore > 0.6
    ) {
      logger.warn("Image is flagged as NSFW or harmful.");
      throw new Error("Image is not allowed due to NSFW or harmful content.");
    }

    logger.info("Image passed NSFW validation.");
    return data;
  } catch (error) {
    if (error.response) {
      logger.error(error.response.data);
      console.error(error.response.data);
    } else {
      logger.error(error.message);
      console.error(error.message);
    }
    throw error;
  }
};
