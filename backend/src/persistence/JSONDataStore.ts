import fs from "fs";
import path from "path";
import { DATA_STORAGE_DIR } from "../utils/config";

/**
 * Generic JSON data store for persisting data to JSON files
 * @template T The type of data to be stored
 */
export class JSONDataStore<T> {
  private filePath: string;

  /**
   * Creates a new JSONDataStore
   * @param filePath Path to the JSON file, relative to DATA_STORAGE_DIR
   */
  constructor(filePath: string) {
    // Use DATA_STORAGE_DIR as the base directory
    this.filePath = path.join(DATA_STORAGE_DIR, filePath);
    this.ensureDirectoryExists();
  }

  /**
   * Ensures the directory for the JSON file exists
   */
  private ensureDirectoryExists(): void {
    const directory = path.dirname(this.filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  /**
   * Reads all data from the JSON file
   * @returns The data from the file or an empty array if the file doesn't exist
   */
  async readAll(): Promise<T[]> {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }

      const data = await fs.promises.readFile(this.filePath, "utf8");
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error reading from ${this.filePath}:`, error);
      return [];
    }
  }

  /**
   * Writes data to the JSON file
   * @param data The data to write
   */
  async writeAll(data: T[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(this.filePath, jsonData, "utf8");
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      throw new Error(`Failed to write data to ${this.filePath}`);
    }
  }

  /**
   * Adds a single item to the JSON file
   * @param item The item to add
   */
  async add(item: T): Promise<void> {
    const data = await this.readAll();
    data.push(item);
    await this.writeAll(data);
  }

  /**
   * Updates the JSON file with the provided data
   * @param updateFn Function that takes the current data and returns updated data
   */
  async update(updateFn: (data: T[]) => T[]): Promise<void> {
    const data = await this.readAll();
    const updatedData = updateFn(data);
    await this.writeAll(updatedData);
  }

  /**
   * Deletes the JSON file
   */
  async deleteFile(): Promise<void> {
    if (fs.existsSync(this.filePath)) {
      await fs.promises.unlink(this.filePath);
    }
  }
}
