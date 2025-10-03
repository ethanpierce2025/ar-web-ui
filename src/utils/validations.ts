export function isClassroomCodeValid(groupCode: string, length = 8) {
  return new RegExp(`^[a-zA-Z0-9]{${length}}$`).test(groupCode);
}
