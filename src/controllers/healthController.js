export const healthCheck = (req, res) => {
  try {
    return res.status(200).json({
      message: "API Is working successfylly",
      success: true,
    });
  } catch (error) {
    console.log("Error in checking health api ", error);
    return res.status(500).json({
      success: false,
      message: "Error happend in checking error",
      error,
    });
  }
};
