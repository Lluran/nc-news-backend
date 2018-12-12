exports.displayEndPoints = (req, res, next) => {
  return res.status(200).sendFile('views/end_points.html', {
    root: './'
  })
}