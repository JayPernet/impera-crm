# Security Checklist

## Database (RLS)
- [ ] Is RLS enabled on the table? (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Are policies explicit? (Avoid `USING (true)` unless public read is intended)
- [ ] Does the policy check `auth.uid()` where user data is private?
- [ ] Is `service_role` kept out of client-side logic?

## API (Edge Functions)
- [ ] Are inputs validated? (e.g., ensuring `email` is actually an email)
- [ ] Are environment variables used for secrets? (Never hardcode keys)
- [ ] Is CORS handled correctly?
- [ ] Are error messages sanitized? (Don't leak stack traces to client)

## Performance impact on Security
- [ ] Do RLS policies use indexed columns? (Slow policies = Slow queries)
