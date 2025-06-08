#!/usr/bin/env node
// Test script for backup and restore functionality

const { BackupManager } = require('../lib/backup/backupManager');
const { dataExporter } = require('../lib/backup/dataExporter');
const fs = require('fs');
const path = require('path');

class BackupTestSuite {
  constructor() {
    this.backupManager = new BackupManager();
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Starting Backup & Restore Test Suite...\n');

    const tests = [
      this.testDatabaseBackup,
      this.testFileBackup,
      this.testDataExport,
      this.testBackupRestore,
      this.testBackupCleanup,
      this.testBackupScheduling
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.logResult(test.name, false, error.message);
      }
    }

    this.printResults();
  }

  async testDatabaseBackup() {
    console.log('📊 Testing database backup...');
    
    const result = await this.backupManager.createDatabaseBackup({
      includeSchema: true,
      includeData: true,
      compression: true
    });

    if (result.success && result.backupPath) {
      // Verify backup file exists
      const exists = fs.existsSync(result.backupPath);
      const stats = fs.statSync(result.backupPath);
      
      this.logResult('testDatabaseBackup', exists && stats.size > 0, 
        exists ? `Backup created: ${result.backupPath} (${stats.size} bytes)` : 'Backup file not found');
    } else {
      this.logResult('testDatabaseBackup', false, result.error || 'Unknown error');
    }
  }

  async testFileBackup() {
    console.log('📁 Testing file backup...');
    
    const result = await this.backupManager.createFileBackup({
      includeUploads: true,
      includeConfig: true,
      compression: true
    });

    if (result.success && result.backupPath) {
      const exists = fs.existsSync(result.backupPath);
      const stats = fs.statSync(result.backupPath);
      
      this.logResult('testFileBackup', exists && stats.size > 0,
        exists ? `File backup created: ${result.backupPath} (${stats.size} bytes)` : 'File backup not found');
    } else {
      this.logResult('testFileBackup', false, result.error || 'Unknown error');
    }
  }

  async testDataExport() {
    console.log('📤 Testing data export...');
    
    // Create a test user if needed
    const testUserId = 'test-user-123';
    
    const exportOptions = {
      userId: testUserId,
      format: 'json',
      includePersonalData: true,
      includeDietPlans: true,
      includeAppointments: true,
      includePayments: true,
      includeProgress: true
    };

    try {
      const result = await dataExporter.exportUserData(exportOptions);
      
      if (result.success && result.filePath) {
        const exists = fs.existsSync(result.filePath);
        this.logResult('testDataExport', exists,
          exists ? `Export created: ${result.filePath}` : 'Export file not found');
      } else {
        this.logResult('testDataExport', false, result.error || 'Export failed');
      }
    } catch (error) {
      this.logResult('testDataExport', false, `Export error: ${error.message}`);
    }
  }

  async testBackupRestore() {
    console.log('🔄 Testing backup restore...');
    
    try {
      // List available backups
      const backups = await this.backupManager.listBackups();
      
      if (backups.length === 0) {
        this.logResult('testBackupRestore', false, 'No backups available to test restore');
        return;
      }

      // Test restore validation (dry run)
      const latestBackup = backups[0];
      const restoreResult = await this.backupManager.restoreFromBackup(latestBackup.filename, {
        dryRun: true,
        validateOnly: true
      });

      this.logResult('testBackupRestore', restoreResult.success,
        restoreResult.success ? 'Backup validation passed' : restoreResult.error);
    } catch (error) {
      this.logResult('testBackupRestore', false, `Restore test error: ${error.message}`);
    }
  }

  async testBackupCleanup() {
    console.log('🧹 Testing backup cleanup...');
    
    try {
      const cleanupResult = await this.backupManager.cleanupOldBackups({
        maxAge: 1, // 1 day for testing
        maxCount: 5
      });

      this.logResult('testBackupCleanup', cleanupResult.success,
        `Cleanup completed: ${cleanupResult.deletedCount || 0} files deleted`);
    } catch (error) {
      this.logResult('testBackupCleanup', false, `Cleanup error: ${error.message}`);
    }
  }

  async testBackupScheduling() {
    console.log('⏰ Testing backup scheduling...');
    
    try {
      // Test schedule validation
      const scheduleConfig = {
        frequency: 'daily',
        time: '02:00',
        retention: {
          maxAge: 30,
          maxCount: 10
        }
      };

      const isValidSchedule = this.backupManager.validateScheduleConfig(scheduleConfig);
      
      this.logResult('testBackupScheduling', isValidSchedule,
        isValidSchedule ? 'Schedule configuration valid' : 'Invalid schedule configuration');
    } catch (error) {
      this.logResult('testBackupScheduling', false, `Schedule test error: ${error.message}`);
    }
  }

  logResult(testName, success, message) {
    const result = {
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}: ${message}\n`);
  }

  printResults() {
    console.log('📋 Test Results Summary');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
    
    if (passed === total) {
      console.log('🎉 All backup and restore tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Check the logs above for details.');
    }

    // Save test results
    const resultsPath = path.join(process.cwd(), 'test-results', 'backup-restore-results.json');
    const resultsDir = path.dirname(resultsPath);
    
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    fs.writeFileSync(resultsPath, JSON.stringify({
      summary: {
        total,
        passed,
        failed: total - passed,
        successRate: ((passed / total) * 100).toFixed(1) + '%',
        timestamp: new Date().toISOString()
      },
      results: this.testResults
    }, null, 2));
    
    console.log(`\n📄 Detailed results saved to: ${resultsPath}`);
  }
}

// Performance test for large data sets
class BackupPerformanceTest {
  constructor() {
    this.backupManager = new BackupManager();
  }

  async runPerformanceTests() {
    console.log('\n🚀 Running Backup Performance Tests...\n');

    await this.testLargeDatasetBackup();
    await this.testConcurrentBackups();
    await this.testCompressionPerformance();
  }

  async testLargeDatasetBackup() {
    console.log('📈 Testing large dataset backup performance...');
    
    const startTime = Date.now();
    
    try {
      const result = await this.backupManager.createFullBackup({
        includeFiles: true,
        includeDatabase: true,
        compression: true
      });

      const duration = Date.now() - startTime;
      const durationSeconds = (duration / 1000).toFixed(2);
      
      if (result.success) {
        const stats = fs.statSync(result.backupPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Large dataset backup completed in ${durationSeconds}s (${sizeMB}MB)`);
      } else {
        console.log(`❌ Large dataset backup failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Performance test error: ${error.message}`);
    }
  }

  async testConcurrentBackups() {
    console.log('🔀 Testing concurrent backup handling...');
    
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        this.backupManager.createDatabaseBackup({
          compression: true,
          filename: `concurrent-test-${i}`
        })
      );
    }

    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
      console.log(`✅ Concurrent backup test: ${successful}/3 backups successful`);
    } catch (error) {
      console.log(`❌ Concurrent backup test failed: ${error.message}`);
    }
  }

  async testCompressionPerformance() {
    console.log('🗜️  Testing compression performance...');
    
    const testWithCompression = async () => {
      const start = Date.now();
      const result = await this.backupManager.createDatabaseBackup({ compression: true });
      const duration = Date.now() - start;
      const size = result.success ? fs.statSync(result.backupPath).size : 0;
      return { duration, size, success: result.success };
    };

    const testWithoutCompression = async () => {
      const start = Date.now();
      const result = await this.backupManager.createDatabaseBackup({ compression: false });
      const duration = Date.now() - start;
      const size = result.success ? fs.statSync(result.backupPath).size : 0;
      return { duration, size, success: result.success };
    };

    try {
      const [compressed, uncompressed] = await Promise.all([
        testWithCompression(),
        testWithoutCompression()
      ]);

      if (compressed.success && uncompressed.success) {
        const compressionRatio = ((uncompressed.size - compressed.size) / uncompressed.size * 100).toFixed(1);
        const speedDiff = compressed.duration - uncompressed.duration;
        
        console.log(`✅ Compression saved ${compressionRatio}% space (+${speedDiff}ms processing time)`);
      } else {
        console.log('❌ Compression test failed');
      }
    } catch (error) {
      console.log(`❌ Compression test error: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  try {
    const testSuite = new BackupTestSuite();
    await testSuite.runAllTests();
    
    const performanceTest = new BackupPerformanceTest();
    await performanceTest.runPerformanceTests();
    
    console.log('\n🏁 All tests completed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  main();
}

module.exports = { BackupTestSuite, BackupPerformanceTest };