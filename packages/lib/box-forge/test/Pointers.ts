/**
 * Pointer categories referenced by the test schemas. When forging, these map
 * pointer fields to the corresponding connection types.
 */
export enum PointerType {
  NetworkModule,
  AudioConnection,
  AudioInput,
  AudioOutput,
  NoteConnection,
  NoteInput,
  NoteOutput,
  ParameterAutomation,
  ParameterModulation,
  Groove,
}
