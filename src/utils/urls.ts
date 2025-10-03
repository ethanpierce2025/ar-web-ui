export const openUrlInNewTab = (url: string) => {
  window.open(url, '_blank');
};

export const mailTo = (email: string) => openUrlInNewTab(`mailto:${email}`);
