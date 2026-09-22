document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".banner__video");

  video.play().catch(function (error) {
    console.error("Автоплей заблоковано:", error);
  });

  video.playbackRate = 1.0;
});
