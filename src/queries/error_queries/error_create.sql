INSERT INTO errorLog
(
  errorLogId
 ,level
 ,message
 ,detail
 ,stack
 ,errorDate
)
SELECT
  :errorLogId,
  :level,
  :message,
  :detail,
  :stack,
  :errorDate
